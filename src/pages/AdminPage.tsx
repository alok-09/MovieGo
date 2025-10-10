import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Star, Users, Trash2, CreditCard as Edit, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserStore } from '../store/userStore';
import AddCinemaModal, { CinemaFormData } from '../components/AddCinemaModal';
import EditCinemaModal from '../components/EditCinemaModal';
import SeatLayoutModal from '../components/SeatLayoutModal';
import axios from 'axios';

interface Cinema {
  _id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  totalSeats: number;
}

interface MovieBooking {
  imdbID: string;
  movieTitle: string;
  showDate: string;
  showtime: string;
  totalBookings: number;
  totalSeats: number;
  bookings: Array<{
    _id: string;
    userId: string;
    seats: string[];
    totalPrice: number;
    bookingDate: string;
  }>;
}

interface Movie {
  Title: string;
  Poster: string;
  imdbID: string;
}

const API_URL = 'http://localhost:5000/api';
const OMDB_API_KEY = 'e37a1a0e';

function AdminPage() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading: isAuthLoading } = useUserStore();
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState<Cinema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [movieBookings, setMovieBookings] = useState<MovieBooking[]>([]);
  const [movieCache, setMovieCache] = useState<Record<string, Movie>>({});
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);
  const [isSeatLayoutOpen, setIsSeatLayoutOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<{
    showtimeId: string;
    movieTitle: string;
    cinemaName: string;
    date: string;
    time: string;
  } | null>(null);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please log in to access the admin panel');
      navigate('/login');
      return;
    }

    if (user?.role !== 'admin') {
      toast.error('You do not have admin privileges');
      navigate('/');
      return;
    }

    fetchCinemas();
  }, [isAuthenticated, user, navigate, isAuthLoading]);

  const fetchCinemas = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get(`${API_URL}/cinemas`);
      setCinemas(response.data);
    } catch (error) {
      toast.error('Failed to load cinemas');
    } finally {
      setIsFetching(false);
    }
  };

  const fetchMovieBookings = async (cinemaId: string) => {
    try {
      const response = await axios.get(`${API_URL}/bookings/cinema/${cinemaId}`);
      const bookingsData = response.data;
      setMovieBookings(bookingsData);

      const uniqueImdbIds = [...new Set(bookingsData.map((b: MovieBooking) => b.imdbID))];
      for (const imdbID of uniqueImdbIds) {
        if (!movieCache[imdbID]) {
          try {
            const movieResponse = await axios.get(
              `https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`
            );
            if (movieResponse.data.Response === 'True') {
              setMovieCache(prev => ({
                ...prev,
                [imdbID]: movieResponse.data
              }));
            }
          } catch (error) {
            console.error(`Failed to fetch movie ${imdbID}:`, error);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to load bookings');
    }
  };

  const handleViewBookingDetails = async (booking: MovieBooking, cinema: Cinema) => {
    try {
      const response = await axios.get(`${API_URL}/showtimes/cinema/${cinema._id}`);
      const showtimes = response.data;

      const matchingShowtime = showtimes.find((s: any) =>
        s.imdbID === booking.imdbID &&
        s.date === booking.showDate &&
        s.time === booking.showtime
      );

      if (matchingShowtime) {
        setSelectedShowtime({
          showtimeId: matchingShowtime._id,
          movieTitle: booking.movieTitle,
          cinemaName: cinema.name,
          date: booking.showDate,
          time: booking.showtime,
        });
        setIsSeatLayoutOpen(true);
      } else {
        toast.error('Showtime not found');
      }
    } catch (error) {
      toast.error('Failed to load showtime details');
    }
  };

  const handleAddCinema = async (formData: CinemaFormData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/cinemas`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCinemas([...cinemas, response.data]);
      toast.success('Cinema added successfully');
      setIsModalOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add cinema';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCinema = (cinema: Cinema) => {
    setEditingCinema(cinema);
    setIsEditModalOpen(true);
  };

  const handleUpdateCinema = async (formData: CinemaFormData) => {
    if (!editingCinema) return;

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/cinemas/${editingCinema._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCinemas(cinemas.map(cinema =>
        cinema._id === editingCinema._id ? response.data : cinema
      ));
      toast.success('Cinema updated successfully');
      setIsEditModalOpen(false);
      setEditingCinema(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update cinema';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCinema = async (cinemaId: string) => {
    if (!confirm('Are you sure you want to delete this cinema?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/cinemas/${cinemaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCinemas(cinemas.filter(cinema => cinema._id !== cinemaId));
      toast.success('Cinema deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete cinema';
      toast.error(errorMessage);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Add Cinema
            </button>
          </div>
          <p className="text-gray-600">Manage cinemas and view all active locations</p>
        </div>

        {isFetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-1">Total Cinemas</p>
                      <p className="text-3xl font-bold text-blue-900">{cinemas.length}</p>
                    </div>
                    <div className="bg-blue-600 p-3 rounded-lg">
                      <MapPin size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">Total Seats</p>
                      <p className="text-3xl font-bold text-green-900">
                        {cinemas.reduce((sum, cinema) => sum + cinema.totalSeats, 0)}
                      </p>
                    </div>
                    <div className="bg-green-600 p-3 rounded-lg">
                      <Users size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600 mb-1">Avg Rating</p>
                      <p className="text-3xl font-bold text-yellow-900">
                        {cinemas.length > 0
                          ? (cinemas.reduce((sum, cinema) => sum + cinema.rating, 0) / cinemas.length).toFixed(1)
                          : '0.0'}
                      </p>
                    </div>
                    <div className="bg-yellow-600 p-3 rounded-lg">
                      <Star size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">All Cinemas</h2>
              </div>

              {cinemas.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">No cinemas yet. Add your first cinema to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cinema Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Distance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Seats
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cinemas.map((cinema) => (
                        <tr key={cinema._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{cinema.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin size={16} />
                              {cinema.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{cinema.distance}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-sm text-gray-900">
                              <Star size={16} className="text-yellow-500 fill-current" />
                              {cinema.rating}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{cinema.totalSeats}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditCinema(cinema)}
                                className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                                title="Edit cinema"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteCinema(cinema._id)}
                                className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                title="Delete cinema"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Active Bookings by Cinema</h2>
                <p className="text-sm text-gray-600 mt-1">Select a cinema to view movies with active bookings</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Cinema
                  </label>
                  <select
                    value={selectedCinemaId || ''}
                    onChange={(e) => {
                      const cinemaId = e.target.value;
                      setSelectedCinemaId(cinemaId);
                      if (cinemaId) {
                        fetchMovieBookings(cinemaId);
                      } else {
                        setMovieBookings([]);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Select a cinema --</option>
                    {cinemas.map((cinema) => (
                      <option key={cinema._id} value={cinema._id}>
                        {cinema.name} - {cinema.location}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCinemaId && movieBookings.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Movie
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Bookings
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Booked Seats
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {movieBookings.map((booking, index) => {
                          const movie = movieCache[booking.imdbID];
                          const cinema = cinemas.find(c => c._id === selectedCinemaId);
                          return (
                            <tr key={`${booking.imdbID}-${booking.showDate}-${booking.showtime}-${index}`} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {movie?.Poster && movie.Poster !== 'N/A' && (
                                    <img
                                      src={movie.Poster}
                                      alt={movie.Title}
                                      className="w-10 h-14 object-cover rounded"
                                    />
                                  )}
                                  <div className="text-sm font-medium text-gray-900">
                                    {movie?.Title || booking.movieTitle}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">{booking.showDate}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">{booking.showtime}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{booking.totalBookings}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{booking.totalSeats} seats</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => cinema && handleViewBookingDetails(booking, cinema)}
                                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                                  title="View seat layout"
                                >
                                  <Eye size={18} />
                                  <span className="text-sm font-medium">View Seats</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedCinemaId && movieBookings.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No active bookings for this cinema.</p>
                  </div>
                )}

                {!selectedCinemaId && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Select a cinema to view active bookings.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <AddCinemaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddCinema}
          isLoading={isLoading}
        />

        <EditCinemaModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCinema(null);
          }}
          onUpdate={handleUpdateCinema}
          isLoading={isLoading}
          cinema={editingCinema ? {
            name: editingCinema.name,
            location: editingCinema.location,
            distance: editingCinema.distance,
            rating: editingCinema.rating,
            totalSeats: editingCinema.totalSeats,
          } : null}
        />

        {selectedShowtime && (
          <SeatLayoutModal
            isOpen={isSeatLayoutOpen}
            onClose={() => {
              setIsSeatLayoutOpen(false);
              setSelectedShowtime(null);
            }}
            showtimeId={selectedShowtime.showtimeId}
            movieTitle={selectedShowtime.movieTitle}
            cinemaName={selectedShowtime.cinemaName}
            date={selectedShowtime.date}
            time={selectedShowtime.time}
          />
        )}
      </div>
    </div>
  );
}

export default AdminPage;

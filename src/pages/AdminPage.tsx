import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Star, Users, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserStore } from '../store/userStore';
import AddCinemaModal, { CinemaFormData } from '../components/AddCinemaModal';
import axios from 'axios';

interface Cinema {
  _id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  totalSeats: number;
}

const API_URL = 'http://localhost:5000/api';

function AdminPage() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading: isAuthLoading } = useUserStore();
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

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
          </>
        )}

        <AddCinemaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddCinema}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default AdminPage;

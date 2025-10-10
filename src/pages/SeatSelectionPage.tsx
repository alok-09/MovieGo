import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Loader } from 'lucide-react';
import SeatGrid from '../components/SeatGrid';
import { useBookingStore } from '../store/bookingStore';
import { useUserStore } from '../store/userStore';
import { getMovieById, MovieDetails } from '../services/omdbApi';
import toast from 'react-hot-toast';

export default function SeatSelectionPage() {
  const { cinemaId, movieId } = useParams<{ cinemaId: string; movieId: string }>();
  const navigate = useNavigate();
  const { currentSelection, createBooking, clearSelection } = useBookingStore();
  const { user } = useUserStore();
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const selectedSeats = currentSelection.selectedSeats;
  const totalAmount = selectedSeats.length * 200;

  useEffect(() => {
    if (!movieId || !currentSelection.showtime || !currentSelection.showDate) {
      toast.error('Invalid booking details');
      navigate('/');
      return;
    }

    loadMovieDetails();
  }, [movieId]);

  const loadMovieDetails = async () => {
    if (!movieId) return;

    setLoading(true);
    try {
      const response = await getMovieById(movieId);
      if (response.Response === 'True') {
        setMovieDetails(response);
      }
    } catch (error) {
      toast.error('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setIsBooking(true);
    try {
      await createBooking(user.id);
      toast.success('Booking confirmed!');
      navigate('/confirmation');
    } catch (error) {
      // Error already handled in store
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  const posterUrl = movieDetails?.Poster !== 'N/A' ? movieDetails?.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 bg-gradient-to-br from-gray-900 to-gray-800 p-6">
              <img
                src={posterUrl}
                alt={movieDetails?.Title}
                className="w-full rounded-lg shadow-lg mb-4"
              />
            </div>

            <div className="md:w-3/4 p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {movieDetails?.Title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">{currentSelection.cinemaName}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">{currentSelection.showtime}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">
                    {currentSelection.showDate && new Date(currentSelection.showDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {movieDetails && (
                <div className="space-y-2 text-gray-600 bg-gray-50 p-4 rounded-lg">
                  <p><span className="font-semibold">Genre:</span> {movieDetails.Genre}</p>
                  <p><span className="font-semibold">Runtime:</span> {movieDetails.Runtime}</p>
                  <p><span className="font-semibold">Rating:</span> {movieDetails.imdbRating}/10</p>
                  <p><span className="font-semibold">Director:</span> {movieDetails.Director}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Select Your Seats
          </h2>
          <SeatGrid />
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 sticky bottom-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-white">
              <p className="text-sm text-gray-400 mb-1">Selected Seats</p>
              <p className="text-2xl font-bold">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
              </p>
            </div>

            <div className="text-white text-center">
              <p className="text-sm text-gray-400 mb-1">Total Amount</p>
              <p className="text-4xl font-bold text-amber-400">₹{totalAmount}</p>
              <p className="text-xs text-gray-400 mt-1">
                ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} × ₹200)
              </p>
            </div>

            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || isBooking}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-12 py-4 rounded-full font-bold text-lg hover:from-orange-500 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center space-x-2"
            >
              {isBooking && <Loader className="w-5 h-5 animate-spin" />}
              <span>{isBooking ? 'Booking...' : 'Book Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

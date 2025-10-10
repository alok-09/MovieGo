import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';
import toast from 'react-hot-toast';

interface Showtime {
  _id: string;
  date: string;
  time: string;
  price: number;
  availableSeats: number;
}

interface ShowtimeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  cinemaId: string;
  cinemaName: string;
}

export default function ShowtimeSelectionModal({
  isOpen,
  onClose,
  movieId,
  movieTitle,
  moviePoster,
  cinemaId,
  cinemaName,
}: ShowtimeSelectionModalProps) {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setCurrentMovie, setCurrentCinema, setShowtime, setShowDate } = useBookingStore();

  useEffect(() => {
    if (isOpen && cinemaId && movieId) {
      loadShowtimes();
    }
  }, [isOpen, cinemaId, movieId]);

  const loadShowtimes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/showtimes/cinema/${cinemaId}/movie/${movieId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch showtimes');
      }
      const data = await response.json();
      setShowtimes(data);

      if (data.length > 0) {
        setSelectedDate(data[0].date);
      }
    } catch (error) {
      console.error('Error loading showtimes:', error);
      toast.error('Failed to load showtimes');
    } finally {
      setLoading(false);
    }
  };

  const uniqueDates = Array.from(new Set(showtimes.map((st) => st.date))).sort();

  const getTimesForDate = (date: string) => {
    return showtimes.filter((st) => st.date === date).sort((a, b) => a.time.localeCompare(b.time));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleProceed = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    setCurrentMovie(movieId, movieTitle, moviePoster);
    setCurrentCinema(cinemaId, cinemaName);
    setShowDate(selectedDate);
    setShowtime(selectedTime);

    navigate(`/show/${cinemaId}/${movieId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{movieTitle}</h2>
            <p className="text-white text-opacity-90">{cinemaName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="w-12 h-12 text-amber-500 animate-spin" />
            </div>
          ) : showtimes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No showtimes available for this movie</p>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {uniqueDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        selectedDate === date
                          ? 'bg-amber-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Select Time</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {getTimesForDate(selectedDate).map((showtime) => (
                      <button
                        key={showtime._id}
                        onClick={() => setSelectedTime(showtime.time)}
                        disabled={showtime.availableSeats === 0}
                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          selectedTime === showtime.time
                            ? 'bg-amber-500 text-white shadow-lg scale-105'
                            : showtime.availableSeats === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-bold">{showtime.time}</div>
                          <div className="text-xs mt-1">
                            {showtime.availableSeats === 0
                              ? 'Full'
                              : `${showtime.availableSeats} seats`}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <button
            onClick={handleProceed}
            disabled={!selectedDate || !selectedTime || loading}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
              selectedDate && selectedTime && !loading
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-orange-500 hover:to-amber-500 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Proceed to Seat Selection
          </button>
        </div>
      </div>
    </div>
  );
}

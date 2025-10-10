import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Star } from 'lucide-react';
import { MovieListItem } from '../services/omdbApi';
import { showtimes } from '../data/cinemas';
import { useBookingStore } from '../store/bookingStore';
import toast from 'react-hot-toast';

interface MovieCardProps {
  movie: MovieListItem;
  cinemaId: string;
  cinemaName: string;
}

export default function MovieCard({ movie, cinemaId, cinemaName }: MovieCardProps) {
  const [showTimes, setShowTimes] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const navigate = useNavigate();
  const { setCurrentMovie, setShowtime, setShowDate } = useBookingStore();

  const generateNextSevenDays = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const availableDates = generateNextSevenDays();

  const handleShowtimeClick = (time: string) => {
    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }
    setCurrentMovie(movie.imdbID, movie.Title, movie.Poster);
    setShowtime(time);
    setShowDate(selectedDate);
    toast.success(`Selected ${movie.Title} on ${new Date(selectedDate).toLocaleDateString()} at ${time}`);
    navigate(`/show/${cinemaId}/${movie.imdbID}`);
  };

  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';

  const handleMovieClick = () => {
    navigate(`/movie/${movie.imdbID}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div
        className="relative overflow-hidden group cursor-pointer"
        onClick={handleMovieClick}
      >
        <img
          src={posterUrl}
          alt={movie.Title}
          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-5">
        <h3
          className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-amber-600 transition-colors"
          onClick={handleMovieClick}
        >
          {movie.Title}
        </h3>

        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{movie.Year}</span>
          </div>
          {movie.vote_average && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowTimes(!showTimes)}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 mb-3"
        >
          {showTimes ? 'Hide Booking Options' : 'Book Tickets'}
        </button>

        {showTimes && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
              <div className="grid grid-cols-3 gap-2">
                {availableDates.map((date) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();
                  const displayDate = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`py-2 px-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedDate === dateStr
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="font-bold">{displayDate}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Showtime</label>
              <div className="grid grid-cols-2 gap-2">
                {showtimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleShowtimeClick(time)}
                    disabled={!selectedDate}
                    className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all duration-300 text-sm font-medium ${
                      !selectedDate
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-800'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{time}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

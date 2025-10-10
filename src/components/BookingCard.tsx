import { Calendar, Clock, MapPin, Ticket, X } from 'lucide-react';
import { Booking } from '../store/bookingStore';

interface BookingCardProps {
  booking: Booking;
  onCancel: (id: string) => void;
}

export default function BookingCard({ booking, onCancel }: BookingCardProps) {
  const posterUrl = booking.moviePoster !== 'N/A' ? booking.moviePoster : 'https://via.placeholder.com/200x300?text=No+Poster';
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const showDate = new Date(booking.showDate).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ${
        booking.status === 'cancelled' ? 'opacity-60' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-32 md:w-40 relative flex-shrink-0">
          <img
            src={posterUrl}
            alt={booking.movieTitle}
            className="w-full h-48 sm:h-full object-cover"
          />
          {booking.status === 'cancelled' && (
            <div className="absolute inset-0 bg-red-500 bg-opacity-90 flex items-center justify-center">
              <div className="text-white text-center">
                <X className="w-10 h-10 mx-auto mb-1" />
                <p className="text-sm font-bold">CANCELLED</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                {booking.movieTitle}
              </h3>
              <p className="text-xs text-gray-500 font-mono bg-gray-100 inline-block px-2 py-1 rounded">
                #{booking.id.slice(-8)}
              </p>
            </div>
            {booking.status === 'confirmed' && (
              <button
                onClick={() => onCancel(booking.id)}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors duration-300 flex items-center space-x-1 text-sm flex-shrink-0"
              >
                <X className="w-3 h-3" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm">
            <div className="flex items-center space-x-2 text-gray-700">
              <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="font-medium truncate">{booking.cinemaName}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Calendar className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>{showDate}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>{booking.showtime}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Ticket className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="truncate">Seats: {booking.seats.join(', ')}</span>
            </div>
          </div>

          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-gray-600 text-sm font-medium">Total</span>
            <span className="text-2xl font-bold text-green-600">
              ₹{booking.totalAmount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

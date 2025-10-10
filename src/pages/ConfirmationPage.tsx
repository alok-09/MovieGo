import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Ticket, Home } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { bookings, clearSelection } = useBookingStore();

  const latestBooking = bookings[0];

  useEffect(() => {
    if (!latestBooking) {
      navigate('/');
    }
  }, [latestBooking, navigate]);

  if (!latestBooking) {
    return null;
  }

  const posterUrl = latestBooking.moviePoster !== 'N/A' ? latestBooking.moviePoster : 'https://via.placeholder.com/300x450?text=No+Poster';

  const bookingDate = new Date(latestBooking.bookingDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 animate-fadeIn">
            <div className="inline-block bg-green-500 rounded-full p-4 sm:p-6 mb-4 shadow-2xl">
              <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Get ready for an amazing cinema experience
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 sm:p-6">
              <p className="text-white text-center font-mono text-sm sm:text-base lg:text-lg break-all">
                Booking ID: <span className="font-bold">{latestBooking.id}</span>
              </p>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col md:flex-row gap-6 sm:gap-8 mb-6 sm:mb-8">
                <div className="md:w-1/3">
                  <img
                    src={posterUrl}
                    alt={latestBooking.movieTitle}
                    className="w-full max-w-xs mx-auto md:max-w-none rounded-lg shadow-lg"
                  />
                </div>

                <div className="md:w-2/3 space-y-4 sm:space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {latestBooking.movieTitle}
                    </h2>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 flex-shrink-0 mt-1" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Cinema</p>
                        <p className="text-gray-600 text-sm sm:text-base truncate">{latestBooking.cinemaName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="flex items-start space-x-3 sm:space-x-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">Date</p>
                          <p className="text-gray-600 text-sm sm:text-base">{bookingDate}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 sm:space-x-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">Showtime</p>
                          <p className="text-gray-600 text-sm sm:text-base">{latestBooking.showtime}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Seats</p>
                        <p className="text-gray-600 text-sm sm:text-base break-words">{latestBooking.seats.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 sm:p-6 rounded-xl text-white">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm opacity-90 mb-1">Total Amount Paid</p>
                        <p className="text-3xl sm:text-4xl font-bold">₹{latestBooking.totalAmount}</p>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="text-xs sm:text-sm opacity-90">{latestBooking.seats.length} Ticket{latestBooking.seats.length > 1 ? 's' : ''}</p>
                        <p className="text-base sm:text-lg font-semibold">@ ₹200 each</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
                <button
                  onClick={() => {
                    clearSelection();
                    navigate('/my-bookings');
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-orange-500 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => {
                    clearSelection();
                    navigate('/');
                  }}
                  className="flex-1 bg-gray-900 text-white py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Back to Home</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center px-4">
            <p className="text-sm sm:text-base text-gray-600">
              Please arrive 15 minutes before showtime. Show this booking ID at the counter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-block bg-green-500 rounded-full p-6 mb-4 shadow-2xl">
              <CheckCircle className="w-24 h-24 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-gray-600">
              Get ready for an amazing cinema experience
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
              <p className="text-white text-center font-mono text-lg">
                Booking ID: <span className="font-bold">{latestBooking.id}</span>
              </p>
            </div>

            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/3">
                  <img
                    src={posterUrl}
                    alt={latestBooking.movieTitle}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>

                <div className="md:w-2/3 space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {latestBooking.movieTitle}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
                      <MapPin className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Cinema</p>
                        <p className="text-gray-600">{latestBooking.cinemaName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
                        <Calendar className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Date</p>
                          <p className="text-gray-600">{bookingDate}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
                        <Clock className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Showtime</p>
                          <p className="text-gray-600">{latestBooking.showtime}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
                      <Ticket className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Seats</p>
                        <p className="text-gray-600">{latestBooking.seats.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm opacity-90 mb-1">Total Amount Paid</p>
                        <p className="text-4xl font-bold">₹{latestBooking.totalAmount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">{latestBooking.seats.length} Ticket{latestBooking.seats.length > 1 ? 's' : ''}</p>
                        <p className="text-lg font-semibold">@ ₹200 each</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <button
                  onClick={() => {
                    clearSelection();
                    navigate('/my-bookings');
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-semibold hover:from-orange-500 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => {
                    clearSelection();
                    navigate('/');
                  }}
                  className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <Home className="w-5 h-5" />
                  <span>Back to Home</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Please arrive 15 minutes before showtime. Show this booking ID at the counter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Ticket, AlertCircle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingCard from '../components/BookingCard';
import CancelConfirmModal from '../components/CancelConfirmModal';
import { useBookingStore } from '../store/bookingStore';
import { useUserStore } from '../store/userStore';
import toast from 'react-hot-toast';

export default function MyBookingsPage() {
  const { bookings, cancelBooking, loadBookings } = useBookingStore();
  const { user } = useUserStore();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{ id: string; movieTitle: string; seats: string[] } | null>(null);

  useEffect(() => {
    loadBookings(user.id);
  }, [user.id]);

  const handleCancel = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (booking) {
      setSelectedBooking({ id, movieTitle: booking.movieTitle, seats: booking.seats });
      setCancelModalOpen(true);
    }
  };

  const confirmCancel = async () => {
    if (!selectedBooking) return;

    try {
      await cancelBooking(selectedBooking.id);
      toast.success('Booking cancelled successfully', {
        duration: 4000,
        icon: '🎬',
        style: {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
          color: '#fff',
          padding: '20px 24px',
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: '0 20px 60px rgba(245, 158, 11, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#f59e0b',
        },
      });
    } catch (error) {
      // Error already handled in store
    } finally {
      setCancelModalOpen(false);
      setSelectedBooking(null);
    }
  };

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <CancelConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={confirmCancel}
        movieTitle={selectedBooking?.movieTitle || ''}
        seats={selectedBooking?.seats || []}
      />

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4">
            <Ticket className="w-12 h-12 text-amber-400" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">My Bookings</h1>
              <p className="text-gray-300 mt-2">
                Manage all your movie bookings in one place
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                No Bookings Yet
              </h2>
              <p className="text-gray-600 mb-8">
                Start your cinema journey by booking your first movie!
              </p>
              <Link
                to="/"
                className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:from-orange-500 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Browse Cinemas
              </Link>
            </div>
          </div>
        ) : (
          <>
            {confirmedBookings.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm">
                    {confirmedBookings.length}
                  </span>
                  <span>Active Bookings</span>
                </h2>
                <div className="space-y-6">
                  {confirmedBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              </div>
            )}

            {cancelledBookings.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm">
                    {cancelledBookings.length}
                  </span>
                  <span>Cancelled Bookings</span>
                </h2>
                <div className="space-y-6">
                  {cancelledBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

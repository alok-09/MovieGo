import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Shield, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserStore } from '../store/userStore';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface UserStats {
  totalBookings: number;
  activeBookings: number;
  cancelledBookings: number;
  totalSpent: number;
}

function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useUserStore();
  const [stats, setStats] = useState<UserStats>({
    totalBookings: 0,
    activeBookings: 0,
    cancelledBookings: 0,
    totalSpent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please log in to view your profile');
      navigate('/login');
      return;
    }

    fetchUserStats();
  }, [isAuthenticated, isAuthLoading, navigate, user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/bookings/user/${user.id}`);
      const bookings = response.data;

      const activeBookings = bookings.filter((b: any) => b.status === 'confirmed');
      const cancelledBookings = bookings.filter((b: any) => b.status === 'cancelled');
      const totalSpent = activeBookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0);

      setStats({
        totalBookings: bookings.length,
        activeBookings: activeBookings.length,
        cancelledBookings: cancelledBookings.length,
        totalSpent,
      });
    } catch (error) {
      toast.error('Failed to load profile stats');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your account information and view your activity</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="bg-white p-3 sm:p-4 rounded-full flex-shrink-0">
                <User size={32} className="sm:w-12 sm:h-12 text-amber-600" />
              </div>
              <div className="text-white min-w-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 truncate">{user.name}</h2>
                <p className="text-sm sm:text-base text-amber-100 flex items-center gap-2">
                  <Mail size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Account Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <User size={18} className="sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-500">Full Name</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">{user.name}</p>
              </div>

              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Mail size={18} className="sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-500">Email Address</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">{user.email}</p>
              </div>

              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Shield size={18} className="sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-500">Account Role</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-gray-900 capitalize">
                  {user.role}
                  {user.role === 'admin' && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      Admin Access
                    </span>
                  )}
                </p>
              </div>

              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Calendar size={18} className="sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-500">Member Since</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {formatDate(new Date().toISOString())}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Booking Statistics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="bg-blue-600 p-2 sm:p-3 rounded-lg">
                    <Ticket size={18} className="sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Total Bookings</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-900">{stats.totalBookings}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="bg-green-600 p-2 sm:p-3 rounded-lg">
                    <Ticket size={18} className="sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-green-600 mb-1">Active Bookings</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-900">{stats.activeBookings}</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="bg-red-600 p-2 sm:p-3 rounded-lg">
                    <Ticket size={18} className="sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-red-600 mb-1">Cancelled Bookings</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-900">{stats.cancelledBookings}</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 sm:p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="bg-amber-600 p-2 sm:p-3 rounded-lg">
                    <span className="text-white text-lg sm:text-2xl font-bold">₹</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-amber-600 mb-1">Total Spent</p>
                <p className="text-2xl sm:text-3xl font-bold text-amber-900">₹{stats.totalSpent}</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={() => navigate('/my-bookings')}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All My Bookings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;

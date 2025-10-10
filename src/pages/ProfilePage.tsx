import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Shield, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserStore } from '../store/userStore';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and view your activity</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-12">
            <div className="flex items-center gap-6">
              <div className="bg-white p-4 rounded-full">
                <User size={48} className="text-amber-600" />
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
                <p className="text-amber-100 flex items-center gap-2">
                  <Mail size={16} />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <User size={20} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-500">Full Name</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{user.name}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={20} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-500">Email Address</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={20} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-500">Account Role</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {user.role}
                  {user.role === 'admin' && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      Admin Access
                    </span>
                  )}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar size={20} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-500">Member Since</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
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
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Ticket size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalBookings}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-green-600 p-3 rounded-lg">
                    <Ticket size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-sm font-medium text-green-600 mb-1">Active Bookings</p>
                <p className="text-3xl font-bold text-green-900">{stats.activeBookings}</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-red-600 p-3 rounded-lg">
                    <Ticket size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-sm font-medium text-red-600 mb-1">Cancelled Bookings</p>
                <p className="text-3xl font-bold text-red-900">{stats.cancelledBookings}</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-amber-600 p-3 rounded-lg">
                    <span className="text-white text-2xl font-bold">₹</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-amber-600 mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-amber-900">₹{stats.totalSpent}</p>
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

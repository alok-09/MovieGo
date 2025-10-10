import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, Ticket, LogOut, User, LogIn, Settings, Menu, X } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-1.5 sm:p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-300">
              <Film className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                BookMyRadiant
              </h1>
              <p className="text-xs text-gray-400 hidden md:block">
                Your Ultimate Movie Experience
              </p>
            </div>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/')
                  ? 'bg-amber-500 text-gray-900 font-semibold'
                  : 'text-gray-300 hover:text-amber-400 hover:bg-gray-800'
              }`}
            >
              <Film className="w-5 h-5" />
              <span>Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-bookings"
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/my-bookings')
                      ? 'bg-amber-500 text-gray-900 font-semibold'
                      : 'text-gray-300 hover:text-amber-400 hover:bg-gray-800'
                  }`}
                >
                  <Ticket className="w-5 h-5" />
                  <span>My Bookings</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive('/admin')
                        ? 'bg-amber-500 text-gray-900 font-semibold'
                        : 'text-gray-300 hover:text-amber-400 hover:bg-gray-800'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/profile')
                      ? 'bg-amber-500 text-gray-900 font-semibold'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <User className={`w-5 h-5 ${isActive('/profile') ? 'text-gray-900' : 'text-amber-400'}`} />
                  <span className="hidden xl:inline">{user?.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-gray-800 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-500 text-gray-900 font-semibold hover:bg-amber-600 transition-all duration-300"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </nav>
        </div>

        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive('/')
                    ? 'bg-amber-500 text-gray-900 font-semibold'
                    : 'text-gray-300 hover:text-amber-400 hover:bg-gray-800'
                }`}
              >
                <Film className="w-5 h-5" />
                <span>Home</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-bookings"
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive('/my-bookings')
                        ? 'bg-amber-500 text-gray-900 font-semibold'
                        : 'text-gray-300 hover:text-amber-400 hover:bg-gray-800'
                    }`}
                  >
                    <Ticket className="w-5 h-5" />
                    <span>My Bookings</span>
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive('/admin')
                          ? 'bg-amber-500 text-gray-900 font-semibold'
                          : 'text-gray-300 hover:text-amber-400 hover:bg-gray-800'
                      }`}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Admin</span>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive('/profile')
                        ? 'bg-amber-500 text-gray-900 font-semibold'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <User className={`w-5 h-5 ${isActive('/profile') ? 'text-gray-900' : 'text-amber-400'}`} />
                    <span>{user?.name}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-red-400 hover:bg-gray-800 transition-all duration-300 text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-amber-500 text-gray-900 font-semibold hover:bg-amber-600 transition-all duration-300"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

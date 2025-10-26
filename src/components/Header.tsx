import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Calendar, Settings } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logoutUser } from '../features/auth/authSlice';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
              <span className="text-white">L</span>
            </div>
            <span className="text-neutral-900">LuxeStay</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/search"
              className="text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              Rooms
            </Link>
            <Link
              to="/about"
              className="text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <div className="w-9 h-9 bg-neutral-900 rounded-full flex items-center justify-center">
                    <span className="text-sm text-white">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <span className="text-neutral-900">{user?.firstName}</span>
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-20">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
                      >
                        <User className="w-5 h-5 text-neutral-600" />
                        <span className="text-neutral-900">Profile</span>
                      </Link>
                      <Link
                        to="/bookings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
                      >
                        <Calendar className="w-5 h-5 text-neutral-600" />
                        <span className="text-neutral-900">My Bookings</span>
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
                        >
                          <Settings className="w-5 h-5 text-neutral-600" />
                          <span className="text-neutral-900">Admin Dashboard</span>
                        </Link>
                      )}
                      <div className="my-2 border-t border-neutral-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-5 h-5 text-neutral-600" />
                        <span className="text-neutral-900">Log Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-neutral-900 hover:text-neutral-700 transition-colors px-4 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-neutral-900 text-white px-6 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-neutral-50"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-neutral-900" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-neutral-100">
            <div className="flex flex-col gap-4">
              <Link
                to="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-700 hover:text-neutral-900 transition-colors py-2"
              >
                Rooms
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-700 hover:text-neutral-900 transition-colors py-2"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-700 hover:text-neutral-900 transition-colors py-2"
              >
                Contact
              </Link>
              
              {isAuthenticated ? (
                <>
                  <div className="border-t border-neutral-100 my-2" />
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-neutral-700 hover:text-neutral-900 transition-colors py-2"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-neutral-700 hover:text-neutral-900 transition-colors py-2"
                  >
                    My Bookings
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-neutral-700 hover:text-neutral-900 transition-colors py-2"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-neutral-700 hover:text-neutral-900 transition-colors py-2 text-left"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-neutral-100 my-2" />
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-neutral-900 py-2"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-neutral-900 text-white px-6 py-3 rounded-xl text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

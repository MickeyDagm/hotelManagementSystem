import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  Settings, 
  Bell,
  Home,
  BarChart3,
  Users,
  Calendar,
  Building
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logoutUser } from '../features/auth/authSlice';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-neutral-200">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <div>
              <h2 className="font-bold text-neutral-900">Hotel System</h2>
              <p className="text-xs text-neutral-600 capitalize">{user?.role} Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {/* Common Navigation */}
            <Link
              to={isAdmin ? '/admin/dashboard' : '/manager/dashboard'}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            {/* Admin-specific navigation */}
            {isAdmin && (
              <>
                <Link
                  to="/admin/users"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span>User Management</span>
                </Link>
                <Link
                  to="/admin/system"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>System Settings</span>
                </Link>
              </>
            )}

            {/* Manager and Admin navigation */}
            {(isManager || isAdmin) && (
              <>
                <Link
                  to="/bookings"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Bookings</span>
                </Link>
                <Link
                  to="/rooms"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                >
                  <Building className="w-5 h-5" />
                  <span>Room Management</span>
                </Link>
              </>
            )}

            <div className="border-t border-neutral-200 my-4"></div>

            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Back to Website</span>
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-neutral-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-neutral-600">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

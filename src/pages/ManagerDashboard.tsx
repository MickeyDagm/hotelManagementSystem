import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useAppSelector } from '../app/hooks';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DashboardLayout } from '../components/DashboardLayout';
import { AnalyticsService } from '../services/adminService';
import { BookingService } from '../services/bookingService';
import { toast } from 'sonner';
import { Booking } from '../types';

interface ManagerStats {
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  pendingBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
}

export const ManagerDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'rooms' | 'guests'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Real Firebase data
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await AnalyticsService.getAdminStats();
      setStats({
        totalBookings: statsData.totalBookings,
        totalRevenue: statsData.totalRevenue,
        occupancyRate: statsData.occupancyRate,
        pendingBookings: statsData.pendingBookings,
        todayCheckIns: statsData.todayCheckIns,
        todayCheckOuts: statsData.todayCheckOuts
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      setBookingsLoading(true);
      const bookingsData = await BookingService.getAllBookings();
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setBookingsLoading(false);
    }
  };

  // Load bookings when bookings tab is active
  useEffect(() => {
    if (activeTab === 'bookings' && bookings.length === 0) {
      loadBookings();
    }
  }, [activeTab]);

  const filteredBookings = bookings.filter(booking => {
    const guestName = `${booking.guestInfo?.firstName || ''} ${booking.guestInfo?.lastName || ''}`;
    const matchesSearch = guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (booking.guestInfo?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Booking management functions
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await BookingService.updateBookingStatus(bookingId, newStatus as 'pending' | 'confirmed' | 'cancelled' | 'completed');
      toast.success('Booking status updated successfully');
      loadBookings(); // Refresh bookings list
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, color = 'text-neutral-900' }: {
    title: string;
    value: string | number;
    icon: any;
    change?: string;
    color?: string;
  }) => (
    <div className="bg-white rounded-2xl p-6 border border-neutral-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color === 'text-green-600' ? 'bg-green-100' : 
                        color === 'text-blue-600' ? 'bg-blue-100' : 
                        color === 'text-yellow-600' ? 'bg-yellow-100' : 'bg-neutral-100'} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {change && (
          <span className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-neutral-900 mb-1">{value}</h3>
      <p className="text-neutral-600 text-sm">{title}</p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Manager Dashboard</h1>
              <p className="text-neutral-600">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-xl hover:bg-neutral-800">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-neutral-100 rounded-xl p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'bookings', label: 'Bookings' },
            { id: 'rooms', label: 'Rooms' },
            { id: 'guests', label: 'Guests' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-4 text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
                  <p className="text-neutral-600 mt-2">Loading stats...</p>
                </div>
              ) : stats ? (
                <>
                  <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    icon={Calendar}
                    change="+12%"
                    color="text-blue-600"
                  />
                  <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={DollarSign}
                    change="+8%"
                    color="text-green-600"
                  />
                  <StatCard
                    title="Occupancy Rate"
                    value={`${stats.occupancyRate}%`}
                    icon={TrendingUp}
                    change="+5%"
                    color="text-yellow-600"
                  />
                  <StatCard
                    title="Pending Bookings"
                    value={stats.pendingBookings}
                    icon={Clock}
                  />
                </>
              ) : null}
            </div>

            {/* Today's Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-neutral-100">
                <h3 className="text-lg font-semibold mb-4">Today's Check-ins</h3>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-600">{stats?.todayCheckIns || 0}</span>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-neutral-600 text-sm mt-2">Guests arriving today</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-neutral-100">
                <h3 className="text-lg font-semibold mb-4">Today's Check-outs</h3>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-blue-600">{stats?.todayCheckOuts || 0}</span>
                  <XCircle className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-neutral-600 text-sm mt-2">Guests departing today</p>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-100">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">Booking ID</th>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">Guest</th>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">Room</th>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">Dates</th>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">Total</th>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-4 px-6">
                          <span className="font-medium text-neutral-900">{booking.id}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-neutral-900">
                              {booking.guestInfo?.firstName} {booking.guestInfo?.lastName}
                            </p>
                            <p className="text-sm text-neutral-600">{booking.guestInfo?.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-neutral-900">{booking.room?.name || `Room ${booking.roomId}`}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <p className="text-neutral-900">{formatDate(booking.checkIn, 'short')}</p>
                            <p className="text-neutral-600">to {formatDate(booking.checkOut, 'short')}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-neutral-900">{formatCurrency(booking.total)}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <select
                              value={booking.status}
                              onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                              className="p-1 text-xs border border-neutral-200 rounded"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="completed">Completed</option>
                            </select>
                            <button 
                              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="bg-white rounded-2xl p-8 border border-neutral-100 text-center">
            <h3 className="text-lg font-semibold mb-2">Room Management</h3>
            <p className="text-neutral-600 mb-4">Manage room inventory, pricing, and availability</p>
            <button className="bg-neutral-900 text-white px-6 py-3 rounded-xl hover:bg-neutral-800">
              Coming Soon
            </button>
          </div>
        )}

        {/* Guests Tab */}
        {activeTab === 'guests' && (
          <div className="bg-white rounded-2xl p-8 border border-neutral-100 text-center">
            <h3 className="text-lg font-semibold mb-2">Guest Management</h3>
            <p className="text-neutral-600 mb-4">View guest profiles, preferences, and history</p>
            <button className="bg-neutral-900 text-white px-6 py-3 rounded-xl hover:bg-neutral-800">
              Coming Soon
            </button>
          </div>
        )}
      </div>
      </div>
    </DashboardLayout>
  );
};

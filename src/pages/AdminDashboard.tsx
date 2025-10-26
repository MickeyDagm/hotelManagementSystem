import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Settings,
  Shield,
  BarChart3,
  UserCheck,
  UserX,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  AlertTriangle
} from 'lucide-react';
import { useAppSelector } from '../app/hooks';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DashboardLayout } from '../components/DashboardLayout';
import { 
  UserService, 
  RoomService, 
  AnalyticsService,
  AdminStats,
  SystemAlert 
} from '../services/adminService';
import { BookingService } from '../services/bookingService';
import { toast } from 'sonner';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'customer' | 'manager' | 'staff' | 'admin';
  isActive?: boolean;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings' | 'rooms' | 'analytics' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Real Firebase data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, alertsData] = await Promise.all([
        AnalyticsService.getAdminStats(),
        AnalyticsService.getSystemAlerts()
      ]);
      setStats(statsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const usersData = await UserService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Load users when users tab is active
  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) {
      loadUsers();
    }
  }, [activeTab]);

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // User management functions
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await UserService.updateUser(userId, { role: newRole as any });
      toast.success('User role updated successfully');
      loadUsers(); // Refresh users list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await UserService.updateUser(userId, { isActive: !currentStatus });
      toast.success('User status updated successfully');
      loadUsers(); // Refresh users list
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await UserService.deleteUser(userId);
        toast.success('User deleted successfully');
        loadUsers(); // Refresh users list
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-50';
      case 'manager': return 'text-purple-600 bg-purple-50';
      case 'staff': return 'text-blue-600 bg-blue-50';
      case 'customer': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (isActive?: boolean) => {
    return isActive !== false ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getStatusText = (isActive?: boolean) => {
    return isActive !== false ? 'Active' : 'Inactive';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'info': return <AlertTriangle className="w-5 h-5 text-blue-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
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
                        color === 'text-yellow-600' ? 'bg-yellow-100' : 
                        color === 'text-red-600' ? 'bg-red-100' : 'bg-neutral-100'} flex items-center justify-center`}>
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
              <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
              <p className="text-neutral-600">Complete system administration and control</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700">
                <Shield className="w-4 h-4" />
                Security Center
              </button>
              <button className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-xl hover:bg-neutral-800">
                <Download className="w-4 h-4" />
                System Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-neutral-100 rounded-xl p-1 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'bookings', label: 'Bookings' },
            { id: 'rooms', label: 'Rooms' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'settings', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
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
            {/* System Alerts */}
            {alerts.filter(alert => !alert.resolved).length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-neutral-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  System Alerts
                </h3>
                <div className="space-y-3">
                  {alerts.filter(alert => !alert.resolved).map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900">{alert.title}</h4>
                        <p className="text-sm text-neutral-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-neutral-500 mt-2">{formatDate(alert.timestamp, 'medium')}</p>
                      </div>
                      <button className="text-neutral-400 hover:text-neutral-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-100 animate-pulse">
                    <div className="w-12 h-12 bg-neutral-200 rounded-xl mb-4"></div>
                    <div className="h-8 bg-neutral-200 rounded mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers.toLocaleString()}
                  icon={Users}
                  change="+12%"
                  color="text-blue-600"
                />
                <StatCard
                  title="Total Revenue"
                  value={formatCurrency(stats.totalRevenue)}
                  icon={DollarSign}
                  change="+18%"
                  color="text-green-600"
                />
                <StatCard
                  title="Total Rooms"
                  value={stats.totalRooms}
                  icon={Building}
                  change="+5%"
                  color="text-yellow-600"
                />
                <StatCard
                  title="Occupancy Rate"
                  value={`${stats.occupancyRate}%`}
                  icon={TrendingUp}
                  change="+8%"
                  color="text-red-600"
                />
              </div>
            ) : null}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-neutral-100">
                <h3 className="text-lg font-semibold mb-4">User Management</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Active Users</span>
                    <span className="font-medium">{stats?.activeUsers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">New This Month</span>
                    <span className="font-medium text-green-600">+{Math.floor(stats?.monthlyGrowth || 0)}%</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('users')}
                  className="w-full mt-4 bg-neutral-900 text-white py-2 rounded-xl hover:bg-neutral-800"
                >
                  Manage Users
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-neutral-100">
                <h3 className="text-lg font-semibold mb-4">System Health</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Server Status</span>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Database</span>
                    <span className="text-green-600 font-medium">Healthy</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="w-full mt-4 bg-neutral-900 text-white py-2 rounded-xl hover:bg-neutral-800"
                >
                  System Settings
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-neutral-100">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Avg. Rating</span>
                    <span className="font-medium">{stats?.averageRating || 0}/5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Total Bookings</span>
                    <span className="font-medium">{stats?.totalBookings || 0}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="w-full mt-4 bg-neutral-900 text-white py-2 rounded-xl hover:bg-neutral-800"
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Management Header */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-100">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <p className="text-neutral-600 text-sm">Manage all system users and their permissions</p>
                </div>
                <button className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-xl hover:bg-neutral-800">
                  <Plus className="w-4 h-4" />
                  Add User
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="all">All Roles</option>
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-100">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">User</th>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">Role</th>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">Last Updated</th>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">Bookings</th>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">Total Spent</th>
                      <th className="text-left py-4 px-6 font-medium text-neutral-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-neutral-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-neutral-600">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
                            {getStatusText(user.isActive)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-neutral-600">{formatDate(user.updatedAt, 'short')}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-neutral-900">-</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-neutral-900">-</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleToggleUserStatus(user.id, user.isActive !== false)}
                              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                              title={user.isActive !== false ? 'Deactivate User' : 'Activate User'}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                              className="p-1 text-xs border border-neutral-200 rounded"
                              disabled={user.role === 'admin'}
                            >
                              <option value="customer">Customer</option>
                              <option value="staff">Staff</option>
                              <option value="manager">Manager</option>
                              <option value="admin">Admin</option>
                            </select>
                            {user.role !== 'admin' && (
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
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

        {/* Other Tabs - Placeholder Content */}
        {['bookings', 'rooms', 'analytics', 'settings'].includes(activeTab) && (
          <div className="bg-white rounded-2xl p-8 border border-neutral-100 text-center">
            <h3 className="text-lg font-semibold mb-2 capitalize">{activeTab} Management</h3>
            <p className="text-neutral-600 mb-4">
              {activeTab === 'bookings' && 'Advanced booking management and analytics'}
              {activeTab === 'rooms' && 'Complete room inventory and pricing control'}
              {activeTab === 'analytics' && 'Detailed system analytics and reporting'}
              {activeTab === 'settings' && 'System configuration and security settings'}
            </p>
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

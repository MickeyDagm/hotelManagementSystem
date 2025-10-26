// Core domain types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'admin' | 'manager' | 'staff';
  avatar?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'single' | 'double' | 'suite' | 'deluxe' | 'penthouse';
  description: string;
  price: number;
  maxOccupancy: number;
  size: number; // in square meters
  images: string[];
  amenities: string[];
  features: string[];
  available: boolean;
  inventory: number; // number of rooms of this type
  rating: number;
  reviewCount: number;
}

export interface SearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  room?: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  subtotal: number;
  taxes: number;
  fees: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guestInfo: GuestInfo;
  extras?: BookingExtra[];
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface BookingExtra {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'paypal' | 'bank_transfer';
  transactionId?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  roomId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: User;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRating: number;
  pendingBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  revenueChange: number;
  bookingsChange: number;
}

export interface FilterOptions {
  roomTypes: string[];
  amenities: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface BookingFormData {
  guestInfo: GuestInfo;
  extras: BookingExtra[];
  promoCode?: string;
}

export interface RoomFormData {
  name: string;
  type: string;
  description: string;
  price: number;
  maxOccupancy: number;
  size: number;
  amenities: string[];
  features: string[];
  inventory: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, Booking, Room } from '../types';

export interface AdminStats {
  totalUsers: number;
  totalRooms: number;
  totalRevenue: number;
  totalBookings: number;
  activeUsers: number;
  occupancyRate: number;
  averageRating: number;
  monthlyGrowth: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  pendingBookings: number;
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

// User Management
export class UserManagementService {
  static async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  static async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async getUsersByRole(role: string): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', role));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  }
}

// Booking Management
export class BookingManagementService {
  static async getAllBookings(): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  static async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
      if (bookingDoc.exists()) {
        return { id: bookingDoc.id, ...bookingDoc.data() } as Booking;
      }
      return null;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  static async updateBookingStatus(bookingId: string, status: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  static async getBookingsByStatus(status: string): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('status', '==', status));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error('Error fetching bookings by status:', error);
      throw error;
    }
  }

  static async getTodayCheckIns(): Promise<Booking[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('checkIn', '==', today));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error('Error fetching today check-ins:', error);
      throw error;
    }
  }

  static async getTodayCheckOuts(): Promise<Booking[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('checkOut', '==', today));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error('Error fetching today check-outs:', error);
      throw error;
    }
  }
}

// Room Management
export class RoomManagementService {
  static async getAllRooms(): Promise<Room[]> {
    try {
      const roomsRef = collection(db, 'rooms');
      const snapshot = await getDocs(roomsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }

  static async getRoomById(roomId: string): Promise<Room | null> {
    try {
      const roomDoc = await getDoc(doc(db, 'rooms', roomId));
      if (roomDoc.exists()) {
        return { id: roomDoc.id, ...roomDoc.data() } as Room;
      }
      return null;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  }

  static async updateRoom(roomId: string, roomData: Partial<Room>): Promise<void> {
    try {
      await updateDoc(doc(db, 'rooms', roomId), {
        ...roomData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  }

  static async createRoom(roomData: Omit<Room, 'id'>): Promise<string> {
    try {
      const roomsRef = collection(db, 'rooms');
      const newRoomRef = doc(roomsRef);
      await setDoc(newRoomRef, {
        ...roomData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return newRoomRef.id;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  static async deleteRoom(roomId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'rooms', roomId));
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
}

// Analytics Service
export class AnalyticsService {
  static async getAdminStats(): Promise<AdminStats> {
    try {
      const [users, bookings, rooms] = await Promise.all([
        UserManagementService.getAllUsers(),
        BookingManagementService.getAllBookings(),
        RoomManagementService.getAllRooms()
      ]);

      const [todayCheckIns, todayCheckOuts, pendingBookings] = await Promise.all([
        BookingManagementService.getTodayCheckIns(),
        BookingManagementService.getTodayCheckOuts(),
        BookingManagementService.getBookingsByStatus('pending')
      ]);

      const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.total || 0), 0);
      const activeUsers = users.filter(user => user.role === 'customer').length;
      const totalRoomsCount = rooms.reduce((sum, room) => sum + (room.inventory || 1), 0);
      const occupiedRooms = bookings.filter(booking => 
        booking.status === 'confirmed' && 
        new Date(booking.checkIn) <= new Date() && 
        new Date(booking.checkOut) >= new Date()
      ).length;

      return {
        totalUsers: users.length,
        totalRooms: totalRoomsCount,
        totalRevenue,
        totalBookings: bookings.length,
        activeUsers,
        occupancyRate: totalRoomsCount > 0 ? Math.round((occupiedRooms / totalRoomsCount) * 100) : 0,
        averageRating: 4.6, // Calculate from reviews
        monthlyGrowth: 15.2, // Calculate based on historical data
        todayCheckIns: todayCheckIns.length,
        todayCheckOuts: todayCheckOuts.length,
        pendingBookings: pendingBookings.length
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  static async getSystemAlerts(): Promise<SystemAlert[]> {
    try {
      // This would typically come from a monitoring system
      // For now, return mock alerts based on real data
      const stats = await this.getAdminStats();
      const alerts: SystemAlert[] = [];

      if (stats.occupancyRate > 90) {
        alerts.push({
          id: 'high_occupancy',
          type: 'warning',
          title: 'High Occupancy Alert',
          message: `Occupancy rate is ${stats.occupancyRate}% - consider overbooking protection`,
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }

      if (stats.pendingBookings > 10) {
        alerts.push({
          id: 'pending_bookings',
          type: 'info',
          title: 'Pending Bookings',
          message: `${stats.pendingBookings} bookings require attention`,
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }

      return alerts;
    } catch (error) {
      console.error('Error fetching system alerts:', error);
      return [];
    }
  }
}

// Export all services
export { UserManagementService as UserService };
export { BookingManagementService };
export { RoomManagementService as RoomService };
export { AnalyticsService };

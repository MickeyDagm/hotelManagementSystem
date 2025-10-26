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
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Booking, Room, User } from '../types';

export class BookingService {
  // Create a new booking
  static async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const newBookingRef = doc(bookingsRef);
      
      const booking: Booking = {
        ...bookingData,
        id: newBookingRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(newBookingRef, booking);
      return newBookingRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Get all bookings with populated room and user data
  static async getAllBookings(): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const bookings = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const bookingData = { id: docSnapshot.id, ...docSnapshot.data() } as Booking;
          
          // Populate room data if roomId exists
          if (bookingData.roomId) {
            try {
              const roomDoc = await getDoc(doc(db, 'rooms', bookingData.roomId));
              if (roomDoc.exists()) {
                bookingData.room = { id: roomDoc.id, ...roomDoc.data() } as Room;
              }
            } catch (error) {
              console.warn(`Could not fetch room ${bookingData.roomId}:`, error);
            }
          }

          return bookingData;
        })
      );

      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  // Get booking by ID
  static async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
      if (bookingDoc.exists()) {
        const bookingData = { id: bookingDoc.id, ...bookingDoc.data() } as Booking;
        
        // Populate room data
        if (bookingData.roomId) {
          try {
            const roomDoc = await getDoc(doc(db, 'rooms', bookingData.roomId));
            if (roomDoc.exists()) {
              bookingData.room = { id: roomDoc.id, ...roomDoc.data() } as Room;
            }
          } catch (error) {
            console.warn(`Could not fetch room ${bookingData.roomId}:`, error);
          }
        }

        return bookingData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  // Update booking status
  static async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
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

  // Update booking
  static async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<void> {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  // Delete booking
  static async deleteBooking(bookingId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  // Get bookings by status
  static async getBookingsByStatus(status: Booking['status']): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error('Error fetching bookings by status:', error);
      throw error;
    }
  }

  // Get bookings by user
  static async getBookingsByUser(userId: string): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const bookings = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const bookingData = { id: docSnapshot.id, ...docSnapshot.data() } as Booking;
          
          // Populate room data
          if (bookingData.roomId) {
            try {
              const roomDoc = await getDoc(doc(db, 'rooms', bookingData.roomId));
              if (roomDoc.exists()) {
                bookingData.room = { id: roomDoc.id, ...roomDoc.data() } as Room;
              }
            } catch (error) {
              console.warn(`Could not fetch room ${bookingData.roomId}:`, error);
            }
          }

          return bookingData;
        })
      );

      return bookings;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  // Get today's check-ins
  static async getTodayCheckIns(): Promise<Booking[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef, 
        where('checkIn', '==', today),
        where('status', 'in', ['confirmed', 'completed'])
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error('Error fetching today check-ins:', error);
      throw error;
    }
  }

  // Get today's check-outs
  static async getTodayCheckOuts(): Promise<Booking[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef, 
        where('checkOut', '==', today),
        where('status', 'in', ['confirmed', 'completed'])
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error('Error fetching today check-outs:', error);
      throw error;
    }
  }

  // Get bookings for date range
  static async getBookingsForDateRange(startDate: string, endDate: string): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('checkIn', '>=', startDate),
        where('checkIn', '<=', endDate),
        orderBy('checkIn', 'asc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error('Error fetching bookings for date range:', error);
      throw error;
    }
  }

  // Calculate occupancy rate
  static async calculateOccupancyRate(): Promise<number> {
    try {
      // Get all rooms
      const roomsRef = collection(db, 'rooms');
      const roomsSnapshot = await getDocs(roomsRef);
      const totalRooms = roomsSnapshot.docs.reduce((sum, doc) => {
        const room = doc.data() as Room;
        return sum + (room.inventory || 1);
      }, 0);

      if (totalRooms === 0) return 0;

      // Get current bookings (checked in but not checked out)
      const today = new Date().toISOString().split('T')[0];
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('status', '==', 'confirmed'),
        where('checkIn', '<=', today),
        where('checkOut', '>', today)
      );
      const snapshot = await getDocs(q);
      const occupiedRooms = snapshot.docs.length;

      return Math.round((occupiedRooms / totalRooms) * 100);
    } catch (error) {
      console.error('Error calculating occupancy rate:', error);
      return 0;
    }
  }
}

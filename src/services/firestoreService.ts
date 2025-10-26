import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  DocumentSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Room, User, Booking, Review, Payment, Extra } from '../types';

// Generic Firestore service functions
export class FirestoreService {
  
  // Get all documents from a collection
  static async getCollection<T>(collectionName: string): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      throw error;
    }
  }

  // Get a single document by ID
  static async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching document ${docId} from ${collectionName}:`, error);
      throw error;
    }
  }

  // Query documents with conditions
  static async queryCollection<T>(
    collectionName: string, 
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      throw error;
    }
  }

  // Add a new document
  static async addDocument<T>(collectionName: string, data: Omit<T, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  }

  // Update an existing document
  static async updateDocument<T>(
    collectionName: string, 
    docId: string, 
    data: Partial<T>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(`Error updating document ${docId} in ${collectionName}:`, error);
      throw error;
    }
  }

  // Delete a document
  static async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${docId} from ${collectionName}:`, error);
      throw error;
    }
  }
}

// Specific service functions for each collection
export class RoomService {
  static async getAllRooms(): Promise<Room[]> {
    return FirestoreService.getCollection<Room>('rooms');
  }

  static async getRoomById(roomId: string): Promise<Room | null> {
    return FirestoreService.getDocument<Room>('rooms', roomId);
  }

  static async getAvailableRooms(): Promise<Room[]> {
    return FirestoreService.queryCollection<Room>('rooms', [
      where('available', '==', true),
      where('status', '==', 'available')
    ]);
  }

  static async getRoomsByType(type: string): Promise<Room[]> {
    return FirestoreService.queryCollection<Room>('rooms', [
      where('type', '==', type),
      where('available', '==', true)
    ]);
  }

  static async searchRooms(filters: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    maxOccupancy?: number;
  }): Promise<Room[]> {
    const constraints: QueryConstraint[] = [where('available', '==', true)];

    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }
    if (filters.minPrice) {
      constraints.push(where('price', '>=', filters.minPrice));
    }
    if (filters.maxPrice) {
      constraints.push(where('price', '<=', filters.maxPrice));
    }
    if (filters.maxOccupancy) {
      constraints.push(where('maxOccupancy', '>=', filters.maxOccupancy));
    }

    return FirestoreService.queryCollection<Room>('rooms', constraints);
  }
}

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    return FirestoreService.getCollection<User>('users');
  }

  static async getUserById(userId: string): Promise<User | null> {
    return FirestoreService.getDocument<User>('users', userId);
  }

  static async getCustomers(): Promise<User[]> {
    return FirestoreService.queryCollection<User>('users', [
      where('role', '==', 'customer')
    ]);
  }

  static async getAdmins(): Promise<User[]> {
    return FirestoreService.queryCollection<User>('users', [
      where('role', '==', 'admin')
    ]);
  }
}

export class BookingService {
  static async getAllBookings(): Promise<Booking[]> {
    return FirestoreService.getCollection<Booking>('bookings');
  }

  static async getBookingById(bookingId: string): Promise<Booking | null> {
    return FirestoreService.getDocument<Booking>('bookings', bookingId);
  }

  static async getUserBookings(userId: string): Promise<Booking[]> {
    return FirestoreService.queryCollection<Booking>('bookings', [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async getRoomBookings(roomId: string): Promise<Booking[]> {
    return FirestoreService.queryCollection<Booking>('bookings', [
      where('roomId', '==', roomId),
      orderBy('checkIn', 'desc')
    ]);
  }

  static async getBookingsByStatus(status: string): Promise<Booking[]> {
    return FirestoreService.queryCollection<Booking>('bookings', [
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async createBooking(bookingData: Omit<Booking, 'id'>): Promise<string> {
    return FirestoreService.addDocument<Booking>('bookings', bookingData);
  }

  static async updateBookingStatus(bookingId: string, status: string): Promise<void> {
    return FirestoreService.updateDocument('bookings', bookingId, { status });
  }
}

export class ReviewService {
  static async getAllReviews(): Promise<Review[]> {
    return FirestoreService.getCollection<Review>('reviews');
  }

  static async getRoomReviews(roomId: string): Promise<Review[]> {
    return FirestoreService.queryCollection<Review>('reviews', [
      where('roomId', '==', roomId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async getUserReviews(userId: string): Promise<Review[]> {
    return FirestoreService.queryCollection<Review>('reviews', [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async createReview(reviewData: Omit<Review, 'id'>): Promise<string> {
    return FirestoreService.addDocument<Review>('reviews', reviewData);
  }
}

export class ExtraService {
  static async getAllExtras(): Promise<Extra[]> {
    return FirestoreService.getCollection<Extra>('extras');
  }

  static async getAvailableExtras(): Promise<Extra[]> {
    return FirestoreService.queryCollection<Extra>('extras', [
      where('available', '==', true)
    ]);
  }

  static async getExtrasByCategory(category: string): Promise<Extra[]> {
    return FirestoreService.queryCollection<Extra>('extras', [
      where('category', '==', category),
      where('available', '==', true)
    ]);
  }
}

export class PaymentService {
  static async getAllPayments(): Promise<Payment[]> {
    return FirestoreService.getCollection<Payment>('payments');
  }

  static async getBookingPayments(bookingId: string): Promise<Payment[]> {
    return FirestoreService.queryCollection<Payment>('payments', [
      where('bookingId', '==', bookingId),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async getUserPayments(userId: string): Promise<Payment[]> {
    return FirestoreService.queryCollection<Payment>('payments', [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async createPayment(paymentData: Omit<Payment, 'id'>): Promise<string> {
    return FirestoreService.addDocument<Payment>('payments', paymentData);
  }
}

// Settings service
export class SettingsService {
  static async getSettings(category: string): Promise<any> {
    return FirestoreService.getDocument('settings', category);
  }

  static async updateSettings(category: string, settings: any): Promise<void> {
    return FirestoreService.updateDocument('settings', category, { settings });
  }
}

// Promo codes service
export class PromoCodeService {
  static async getAllPromoCodes(): Promise<any[]> {
    return FirestoreService.getCollection('promocodes');
  }

  static async getActivePromoCodes(): Promise<any[]> {
    return FirestoreService.queryCollection('promocodes', [
      where('active', '==', true),
      where('endDate', '>=', new Date())
    ]);
  }

  static async getPromoCodeByCode(code: string): Promise<any | null> {
    return FirestoreService.getDocument('promocodes', code);
  }
}

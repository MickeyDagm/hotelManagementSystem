import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Booking validation schemas
export const guestInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  specialRequests: z.string().optional(),
});

export const searchSchema = z.object({
  location: z.string().min(1, 'Please enter a location'),
  checkIn: z.string().min(1, 'Please select check-in date'),
  checkOut: z.string().min(1, 'Please select check-out date'),
  guests: z.number().min(1, 'At least 1 guest is required').max(10, 'Maximum 10 guests allowed'),
}).refine((data) => {
  if (data.checkIn && data.checkOut) {
    return new Date(data.checkOut) > new Date(data.checkIn);
  }
  return true;
}, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOut'],
}).refine((data) => {
  if (data.checkIn) {
    return new Date(data.checkIn) >= new Date(new Date().setHours(0, 0, 0, 0));
  }
  return true;
}, {
  message: 'Check-in date cannot be in the past',
  path: ['checkIn'],
});

// Room validation schemas
export const roomSchema = z.object({
  name: z.string().min(3, 'Room name must be at least 3 characters'),
  type: z.enum(['single', 'double', 'suite', 'deluxe', 'penthouse']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().min(1, 'Price must be greater than 0'),
  maxOccupancy: z.number().min(1, 'Maximum occupancy must be at least 1'),
  size: z.number().min(1, 'Size must be greater than 0'),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  inventory: z.number().min(1, 'Inventory must be at least 1'),
});

// Payment validation schema
export const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardName: z.string().min(3, 'Cardholder name is required'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  billingAddress: z.string().min(5, 'Billing address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

// Utility functions
export const validateRoomAvailability = (
  checkIn: string,
  checkOut: string,
  guests: number,
  maxOccupancy: number
): { valid: boolean; error?: string } => {
  if (guests > maxOccupancy) {
    return {
      valid: false,
      error: `This room can accommodate maximum ${maxOccupancy} guests`,
    };
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    return {
      valid: false,
      error: 'Check-in date cannot be in the past',
    };
  }

  if (checkOutDate <= checkInDate) {
    return {
      valid: false,
      error: 'Check-out date must be after check-in date',
    };
  }

  return { valid: true };
};

export const calculateNights = (checkIn: string, checkOut: string): number => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

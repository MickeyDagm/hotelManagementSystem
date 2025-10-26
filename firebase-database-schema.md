# Firebase Database Schema - Hotel Booking System

## System Overview

This hotel booking system is a comprehensive web application that handles:

- **User Management**: Customer and admin authentication/authorization
- **Room Management**: Hotel room inventory, availability, and details  
- **Booking System**: Complete booking flow from search to confirmation
- **Admin Panel**: Room management, reservation management, and analytics
- **Payment Processing**: Secure payment handling and tracking
- **Reviews & Ratings**: Guest feedback system
- **Analytics**: Business intelligence and reporting

---

## Firebase Collections Schema

### 1. `users` Collection
**Document ID**: Firebase Auth UID

```typescript
{
  id: string,                    // Firebase Auth UID
  email: string,                 // User email (unique)
  firstName: string,             // User's first name
  lastName: string,              // User's last name
  phone?: string,                // Optional phone number
  role: 'customer' | 'admin',    // User role
  avatar?: string,               // Profile picture URL
  preferences: {                 // User preferences
    currency: string,            // Preferred currency (USD, EUR, etc.)
    language: string,            // Preferred language
    newsletter: boolean,         // Newsletter subscription
    notifications: boolean       // Push notifications enabled
  },
  address?: {                    // Optional billing address
    street: string,
    city: string,
    state: string,
    country: string,
    postalCode: string
  },
  loyaltyPoints: number,         // Loyalty program points
  totalBookings: number,         // Total number of completed bookings
  createdAt: Timestamp,          // Account creation date
  updatedAt: Timestamp,          // Last profile update
  lastLoginAt: Timestamp         // Last login timestamp
}
```

**Indexes Required**:
- `email` (unique)
- `role`
- `createdAt`

---

### 2. `rooms` Collection  
**Document ID**: Auto-generated

```typescript
{
  id: string,                    // Document ID
  name: string,                  // Room name
  roomNumber: string,            // Physical room number (e.g., "101", "205A")
  type: 'single' | 'double' | 'suite' | 'deluxe' | 'penthouse',
  description: string,           // Detailed room description
  price: number,                 // Base price per night (USD)
  maxOccupancy: number,          // Maximum number of guests
  size: number,                  // Room size in square meters
  floor: number,                 // Floor number
  images: string[],              // Array of image URLs
  amenities: string[],           // Room amenities
  features: string[],            // Room features
  bedConfiguration: {            // Bed details
    kingBeds: number,
    queenBeds: number,
    singleBeds: number,
    sofaBeds: number
  },
  status: 'available' | 'occupied' | 'maintenance' | 'out-of-order',
  available: boolean,            // General availability flag
  inventory: number,             // Number of rooms of this type available
  rating: number,                // Average rating (0-5)
  reviewCount: number,           // Total number of reviews
  views: number,                 // Number of times viewed
  bookingCount: number,          // Total times booked
  revenue: number,               // Total revenue generated
  seasonalPricing: {             // Seasonal price adjustments
    peak: number,                // Peak season multiplier
    offPeak: number,             // Off-peak season multiplier
    holiday: number              // Holiday season multiplier
  },
  policies: {                    // Room-specific policies
    smokingAllowed: boolean,
    petsAllowed: boolean,
    partiesAllowed: boolean
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes Required**:
- `type`
- `status`
- `available`
- `price`
- `maxOccupancy`
- `rating`
- `roomNumber` (unique)

---

### 3. `bookings` Collection
**Document ID**: Auto-generated

```typescript
{
  id: string,                    // Document ID
  bookingNumber: string,         // Human-readable booking number (e.g., "BK001234")
  userId: string,                // Reference to users collection
  roomId: string,                // Reference to rooms collection
  guestInfo: {                   // Primary guest information
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    specialRequests?: string
  },
  additionalGuests?: {           // Information for additional guests
    firstName: string,
    lastName: string,
    age?: number
  }[],
  checkIn: Timestamp,            // Check-in date and time
  checkOut: Timestamp,           // Check-out date and time
  guests: number,                // Total number of guests
  nights: number,                // Number of nights
  pricing: {                     // Detailed pricing breakdown
    roomRate: number,            // Base room rate per night
    subtotal: number,            // Room rate × nights
    extras: number,              // Additional services total
    taxes: number,               // Taxes amount
    fees: number,                // Service fees
    discount: number,            // Discount amount (if any)
    total: number                // Final total amount
  },
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show',
  paymentStatus: 'pending' | 'paid' | 'partially-paid' | 'refunded' | 'failed',
  paymentMethod?: 'card' | 'paypal' | 'bank_transfer' | 'cash',
  extras: {                      // Additional services booked
    id: string,                  // Service ID
    name: string,                // Service name
    price: number,               // Unit price
    quantity: number,            // Quantity ordered
    category: 'dining' | 'wellness' | 'transport' | 'entertainment'
  }[],
  promoCode?: {                  // Applied promotional code
    code: string,
    discount: number             // Discount amount
  },
  cancellation?: {               // Cancellation details (if applicable)
    reason: string,
    cancelledAt: Timestamp,
    refundAmount: number,
    cancelledBy: string          // User ID who cancelled
  },
  checkInDetails?: {             // Check-in information
    actualCheckIn: Timestamp,
    checkedInBy: string,         // Staff member ID
    keyCards: string[],          // Key card numbers issued
    parking?: string             // Parking spot assigned
  },
  checkOutDetails?: {            // Check-out information
    actualCheckOut: Timestamp,
    checkedOutBy: string,        // Staff member ID
    damages?: {
      description: string,
      cost: number
    }[],
    lateFee?: number
  },
  source: 'website' | 'phone' | 'walk-in' | 'third-party',
  createdAt: Timestamp,
  updatedAt: Timestamp,
  confirmedAt?: Timestamp
}
```

**Indexes Required**:
- `userId`
- `roomId`
- `bookingNumber` (unique)
- `status`
- `paymentStatus`
- `checkIn`
- `checkOut`
- `createdAt`

---

### 4. `payments` Collection
**Document ID**: Auto-generated

```typescript
{
  id: string,                    // Document ID
  bookingId: string,             // Reference to bookings collection
  userId: string,                // Reference to users collection
  amount: number,                // Payment amount
  currency: string,              // Currency code (USD, EUR, etc.)
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled',
  method: 'card' | 'paypal' | 'bank_transfer' | 'cash' | 'points',
  provider: 'stripe' | 'paypal' | 'square' | 'manual',
  transactionId?: string,        // External transaction reference
  gatewayResponse?: any,         // Payment gateway response data
  cardDetails?: {                // Card information (encrypted/tokenized)
    last4: string,               // Last 4 digits
    brand: string,               // Visa, Mastercard, etc.
    expiryMonth: number,
    expiryYear: number
  },
  billingAddress: {              // Billing address
    street: string,
    city: string,
    state: string,
    country: string,
    postalCode: string
  },
  refund?: {                     // Refund details (if applicable)
    amount: number,
    reason: string,
    refundedAt: Timestamp,
    refundId: string
  },
  fees: {                        // Payment processing fees
    processingFee: number,
    platformFee: number
  },
  createdAt: Timestamp,
  updatedAt: Timestamp,
  processedAt?: Timestamp
}
```

**Indexes Required**:
- `bookingId`
- `userId`
- `status`
- `method`
- `transactionId`
- `createdAt`

---

### 5. `reviews` Collection
**Document ID**: Auto-generated

```typescript
{
  id: string,                    // Document ID
  userId: string,                // Reference to users collection
  roomId: string,                // Reference to rooms collection
  bookingId: string,             // Reference to bookings collection
  rating: number,                // Overall rating (1-5)
  ratings: {                     // Detailed ratings
    cleanliness: number,         // 1-5
    comfort: number,             // 1-5
    location: number,            // 1-5
    service: number,             // 1-5
    value: number                // 1-5
  },
  title: string,                 // Review title
  comment: string,               // Review text
  photos?: string[],             // Optional review photos
  helpful: number,               // Number of "helpful" votes
  verified: boolean,             // Verified booking review
  language: string,              // Review language
  status: 'pending' | 'approved' | 'rejected' | 'flagged',
  response?: {                   // Management response
    message: string,
    respondedBy: string,         // Admin user ID
    respondedAt: Timestamp
  },
  flagged?: {                    // If review was flagged
    reason: string,
    flaggedBy: string,
    flaggedAt: Timestamp
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes Required**:
- `userId`
- `roomId`
- `bookingId`
- `rating`
- `status`
- `verified`
- `createdAt`

---

### 6. `extras` Collection
**Document ID**: Auto-generated

```typescript
{
  id: string,                    // Document ID
  name: string,                  // Service name
  description: string,           // Service description
  price: number,                 // Price per unit
  category: 'dining' | 'wellness' | 'transport' | 'entertainment' | 'business',
  subcategory?: string,          // More specific categorization
  images: string[],              // Service images
  available: boolean,            // Current availability
  capacity?: number,             // Max capacity (if applicable)
  duration?: number,             // Duration in minutes (if applicable)
  location?: string,             // Where service is provided
  schedule?: {                   // Operating schedule
    [day: string]: {             // 'monday', 'tuesday', etc.
      open: string,              // Opening time (HH:MM)
      close: string,             // Closing time (HH:MM)
      available: boolean
    }
  },
  policies: {                    // Service policies
    cancellationPolicy: string,
    advanceBooking: number,      // Hours in advance required
    ageRestriction?: number
  },
  popularity: number,            // Booking frequency score
  revenue: number,               // Total revenue generated
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes Required**:
- `category`
- `available`
- `popularity`
- `price`

---

### 7. `promocodes` Collection
**Document ID**: Promo code string

```typescript
{
  code: string,                  // Promo code (Document ID)
  name: string,                  // Campaign name
  description: string,           // Code description
  type: 'percentage' | 'fixed' | 'freeExtras',
  value: number,                 // Discount value
  minAmount?: number,            // Minimum booking amount
  maxDiscount?: number,          // Maximum discount amount
  applicableRooms?: string[],    // Specific room IDs (empty = all rooms)
  startDate: Timestamp,          // Valid from date
  endDate: Timestamp,            // Valid until date
  usageLimit: number,            // Total usage limit
  usageCount: number,            // Current usage count
  userLimit: number,             // Usage limit per user
  active: boolean,               // Code status
  createdBy: string,             // Admin user ID
  usedBy: string[],              // Array of user IDs who used this code
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes Required**:
- `active`
- `startDate`
- `endDate`
- `type`

---

### 8. `analytics` Collection
**Document ID**: Date string (YYYY-MM-DD)

```typescript
{
  date: string,                  // Date (Document ID)
  metrics: {
    totalBookings: number,       // Bookings made on this date
    totalRevenue: number,        // Revenue generated
    checkIns: number,            // Number of check-ins
    checkOuts: number,           // Number of check-outs
    cancellations: number,       // Number of cancellations
    occupancyRate: number,       // Percentage of rooms occupied
    averageDailyRate: number,    // Average room rate
    totalGuests: number,         // Total number of guests
    newUsers: number,            // New user registrations
    returningUsers: number       // Returning customers
  },
  roomMetrics: {                 // Per room type metrics
    [roomType: string]: {
      bookings: number,
      revenue: number,
      occupancyRate: number,
      averageRate: number
    }
  },
  sourceMetrics: {               // Booking source breakdown
    website: number,
    phone: number,
    walkIn: number,
    thirdParty: number
  },
  paymentMetrics: {              // Payment method breakdown
    card: number,
    paypal: number,
    bankTransfer: number,
    cash: number
  },
  monthlyTotals?: {              // Monthly aggregates (stored on last day of month)
    totalBookings: number,
    totalRevenue: number,
    averageOccupancy: number,
    uniqueGuests: number
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes Required**:
- `date`
- `createdAt`

---

### 9. `notifications` Collection
**Document ID**: Auto-generated

```typescript
{
  id: string,                    // Document ID
  userId: string,                // Target user ID
  type: 'booking' | 'payment' | 'reminder' | 'promotion' | 'system',
  title: string,                 // Notification title
  message: string,               // Notification content
  data?: any,                    // Additional data payload
  read: boolean,                 // Read status
  actionUrl?: string,            // URL to navigate to
  icon?: string,                 // Icon identifier
  priority: 'low' | 'medium' | 'high' | 'urgent',
  expiresAt?: Timestamp,         // Expiration time
  channels: {                    // Delivery channels
    inApp: boolean,
    email: boolean,
    sms: boolean,
    push: boolean
  },
  delivered: {                   // Delivery status
    inApp: boolean,
    email: boolean,
    sms: boolean,
    push: boolean
  },
  createdAt: Timestamp,
  readAt?: Timestamp
}
```

**Indexes Required**:
- `userId`
- `type`
- `read`
- `priority`
- `createdAt`

---

### 10. `settings` Collection
**Document ID**: Setting category

```typescript
{
  category: string,              // Document ID (e.g., 'hotel', 'booking', 'payment')
  settings: {
    [key: string]: any           // Dynamic settings object
  },
  updatedBy: string,             // Admin user ID
  updatedAt: Timestamp
}

// Example documents:
// Document ID: 'hotel'
{
  category: 'hotel',
  settings: {
    name: 'LuxeStay Hotel',
    address: '123 Main St, City, Country',
    phone: '+1-555-123-4567',
    email: 'info@luxestay.com',
    website: 'https://luxestay.com',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    timezone: 'America/New_York',
    currency: 'USD',
    defaultLanguage: 'en',
    taxRate: 0.1
  }
}

// Document ID: 'booking'
{
  category: 'booking',
  settings: {
    advanceBookingDays: 365,
    maxGuestsPerRoom: 10,
    cancellationHours: 24,
    modificationHours: 24,
    minStayNights: 1,
    maxStayNights: 30,
    autoConfirmBookings: true,
    requirePaymentUpfront: true
  }
}
```

---

## Security Rules

### Firestore Security Rules Template

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Rooms are readable by all authenticated users, writable by admins only
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Bookings are readable/writable by the user who made them or admins
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Reviews are readable by all, writable by booking owner
    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Admin-only collections
    match /payments/{paymentId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /analytics/{analyticsId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## Implementation Notes

### 1. Data Relationships
- Use Firebase document references for relationships
- Denormalize frequently accessed data for performance
- Implement data consistency through Cloud Functions

### 2. Scalability Considerations
- Use collection groups for cross-collection queries
- Implement pagination for large datasets
- Use composite indexes for complex queries

### 3. Real-time Features
- Use Firestore real-time listeners for booking status updates
- Implement real-time availability updates
- Use Cloud Messaging for push notifications

### 4. Data Migration
- Export existing data to JSON format
- Create batch import scripts for initial data load
- Implement data validation during migration

### 5. Backup Strategy
- Enable automatic Firestore backupsC:\Users\user1\Downloads\Hotel Booking System Development\firebase-database-schema.md
- Implement regular export to Cloud Storage
- Create restore procedures for disaster recovery

This schema provides a robust foundation for the hotel booking system with proper normalization, indexing, and security considerations.

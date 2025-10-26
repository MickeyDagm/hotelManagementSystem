import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, Users, MapPin, Download, Printer } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  // Mock booking data (replace with Firebase later)
  const mockBooking = {
    id: bookingId,
    roomId: '1',
    checkIn: '2024-03-15',
    checkOut: '2024-03-18',
    guests: 2,
    nights: 3,
    totalAmount: 899.97,
    subtotal: 799.97,
    taxes: 79.99,
    fees: 20.01,
    total: 899.97,
    status: 'confirmed',
    extras: [],
    guestInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      specialRequests: ''
    }
  };
  
  // TODO: Replace with Firebase data fetching
  const room = null; // No sample data available
  const booking = null; // No booking data available
  const isLoading = false;
  const error = !booking ? 'Booking not found' : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="mb-2">Booking not found</h3>
          <Link to="/" className="text-neutral-600 hover:text-neutral-900">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-2xl p-12 text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="mb-2">Booking Confirmed!</h2>
          <p className="text-neutral-600 mb-6">
            Thank you for your reservation. We've sent a confirmation email to{' '}
            <strong>{booking.guestInfo.email}</strong>
          </p>
          <div className="inline-block bg-neutral-100 px-6 py-3 rounded-xl">
            <p className="text-sm text-neutral-600 mb-1">Booking ID</p>
            <p className="text-neutral-900">{booking.id}</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-2xl p-8 mb-6">
          <h4 className="mb-6">Reservation Details</h4>

          {/* Room Info */}
          <div className="mb-6 pb-6 border-b border-neutral-100">
            <h5 className="mb-3">{booking.room?.name}</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-neutral-600">
                <Calendar className="w-4 h-4" />
                <span>Check-in: {formatDate(booking.checkIn, 'medium')}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Calendar className="w-4 h-4" />
                <span>Check-out: {formatDate(booking.checkOut, 'medium')}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Users className="w-4 h-4" />
                <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <MapPin className="w-4 h-4" />
                <span>{booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}</span>
              </div>
            </div>
          </div>

          {/* Guest Info */}
          <div className="mb-6 pb-6 border-b border-neutral-100">
            <h5 className="mb-3">Guest Information</h5>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>
                {booking.guestInfo.firstName} {booking.guestInfo.lastName}
              </p>
              <p>{booking.guestInfo.email}</p>
              <p>{booking.guestInfo.phone}</p>
              {booking.guestInfo.specialRequests && (
                <div className="mt-4 p-4 bg-neutral-50 rounded-xl">
                  <p className="text-neutral-900 mb-1">Special Requests:</p>
                  <p>{booking.guestInfo.specialRequests}</p>
                </div>
              )}
            </div>
          </div>

          {/* Extras */}
          {booking.extras && booking.extras.length > 0 && (
            <div className="mb-6 pb-6 border-b border-neutral-100">
              <h5 className="mb-3">Extras</h5>
              <div className="space-y-2">
                {booking.extras.map((extra) => (
                  <div key={extra.id} className="flex justify-between text-sm">
                    <span className="text-neutral-600">{extra.name}</span>
                    <span>{formatCurrency(extra.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-neutral-600">
              <span>Room ({booking.nights} nights)</span>
              <span>{formatCurrency(booking.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Service fee</span>
              <span>{formatCurrency(booking.fees)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Taxes</span>
              <span>{formatCurrency(booking.taxes)}</span>
            </div>
            <div className="border-t border-neutral-100 pt-3">
              <div className="flex justify-between">
                <span>Total Paid</span>
                <span>{formatCurrency(booking.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-900 px-6 py-3 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>
          <button className="flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-900 px-6 py-3 rounded-xl hover:bg-neutral-50 transition-colors">
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h5 className="mb-3 text-blue-900">What's Next?</h5>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• You'll receive a confirmation email with all the details</li>
            <li>• Check-in time is 3:00 PM on {formatDate(booking.checkIn, 'medium')}</li>
            <li>• Bring a valid ID and the credit card used for booking</li>
            <li>• Contact us if you need to make any changes to your reservation</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/bookings"
            className="inline-block bg-neutral-900 text-white px-8 py-3 rounded-xl hover:bg-neutral-800 transition-colors mr-4"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className="inline-block border-2 border-neutral-900 text-neutral-900 px-8 py-3 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

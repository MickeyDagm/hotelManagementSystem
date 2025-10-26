import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { guestInfoSchema } from '../utils/validators';
import { setGuestInfo, addExtra, removeExtra } from '../features/booking/bookingSlice';
import { formatCurrency, calculateNights } from '../utils/formatters';
import { toast } from 'sonner';
import { z } from 'zod';

type GuestInfoFormData = z.infer<typeof guestInfoSchema>;

export const BookingFlow: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedRoom, checkIn, checkOut, guests, extras } = useAppSelector((state) => state.booking);
  const { user } = useAppSelector((state) => state.auth);

  const [selectedExtras, setSelectedExtras] = useState<string[]>(extras.map(e => e.id));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  if (!selectedRoom || !checkIn || !checkOut) {
    navigate('/search');
    return null;
  }

  const nights = calculateNights(checkIn, checkOut);
  const roomTotal = selectedRoom.price * nights;
  const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
  const subtotal = roomTotal + extrasTotal;
  const taxes = subtotal * 0.1;
  const fees = 25;
  const total = subtotal + taxes + fees;

  // TODO: Replace with Firebase data fetching
  const availableExtras: any[] = []; // No sample data available

  const handleExtraToggle = (extraId: string) => {
    const extra = availableExtras.find(e => e.id === extraId);
    if (!extra) return;

    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(prev => prev.filter(id => id !== extraId));
      dispatch(removeExtra(extraId));
    } else {
      setSelectedExtras(prev => [...prev, extraId]);
      dispatch(addExtra({ ...extra, quantity: 1 }));
    }
  };

  const onSubmit = (data: GuestInfoFormData) => {
    dispatch(setGuestInfo(data));
    toast.success('Guest information saved');
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="mb-2">Complete Your Booking</h2>
          <p className="text-neutral-600">Just a few more details and you're all set</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Information */}
            <div className="bg-white rounded-2xl p-8">
              <h4 className="mb-6">Guest Information</h4>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-700 mb-2">First Name</label>
                    <input
                      {...register('firstName')}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.firstName ? 'border-red-300' : 'border-neutral-200'
                      } focus:outline-none focus:ring-2 focus:ring-neutral-900`}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-700 mb-2">Last Name</label>
                    <input
                      {...register('lastName')}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.lastName ? 'border-red-300' : 'border-neutral-200'
                      } focus:outline-none focus:ring-2 focus:ring-neutral-900`}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email ? 'border-red-300' : 'border-neutral-200'
                    } focus:outline-none focus:ring-2 focus:ring-neutral-900`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Phone</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.phone ? 'border-red-300' : 'border-neutral-200'
                    } focus:outline-none focus:ring-2 focus:ring-neutral-900`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-neutral-700 mb-2">
                    Special Requests <span className="text-neutral-400">(Optional)</span>
                  </label>
                  <textarea
                    {...register('specialRequests')}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="Any special requests or requirements?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-neutral-900 text-white py-3 rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Continue to Payment
                </button>
              </form>
            </div>

            {/* Extras */}
            <div className="bg-white rounded-2xl p-8">
              <h4 className="mb-6">Enhance Your Stay</h4>
              
              <div className="space-y-4">
                {availableExtras.length === 0 ? (
                  <p className="text-neutral-500 text-center py-4">No extras available - connect to Firebase</p>
                ) : availableExtras.map((extra) => (
                  <label
                    key={extra.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedExtras.includes(extra.id)
                        ? 'border-neutral-900 bg-neutral-50'
                        : 'border-neutral-100 hover:border-neutral-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExtras.includes(extra.id)}
                      onChange={() => handleExtraToggle(extra.id)}
                      className="mt-1 w-5 h-5 text-neutral-900 rounded focus:ring-neutral-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span>{extra.name}</span>
                        <span>{formatCurrency(extra.price)}</span>
                      </div>
                      <p className="text-sm text-neutral-600">{extra.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 border border-neutral-100">
              <h5 className="mb-6">Booking Summary</h5>

              {/* Room Details */}
              <div className="mb-6 pb-6 border-b border-neutral-100">
                <h6 className="mb-2">{selectedRoom.name}</h6>
                <div className="text-sm text-neutral-600 space-y-1">
                  <p>Check-in: {new Date(checkIn).toLocaleDateString()}</p>
                  <p>Check-out: {new Date(checkOut).toLocaleDateString()}</p>
                  <p>Guests: {guests}</p>
                  <p>Nights: {nights}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-neutral-600">
                  <span>{formatCurrency(selectedRoom.price)} × {nights} nights</span>
                  <span>{formatCurrency(roomTotal)}</span>
                </div>
                
                {extras.length > 0 && (
                  <div className="flex justify-between text-neutral-600">
                    <span>Extras</span>
                    <span>{formatCurrency(extrasTotal)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-neutral-600">
                  <span>Service fee</span>
                  <span>{formatCurrency(fees)}</span>
                </div>
                
                <div className="flex justify-between text-neutral-600">
                  <span>Taxes</span>
                  <span>{formatCurrency(taxes)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-neutral-100 pt-4">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

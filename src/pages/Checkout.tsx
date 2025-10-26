import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { useAppSelector } from '../app/hooks';
// Firebase booking creation will be implemented later
import { paymentSchema } from '../utils/validators';
import { formatCurrency, calculateNights } from '../utils/formatters';
import { toast } from 'sonner';
import { z } from 'zod';

type PaymentFormData = z.infer<typeof paymentSchema>;

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { selectedRoom, checkIn, checkOut, guests, guestInfo, extras } = useAppSelector((state) => state.booking);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  if (!selectedRoom || !checkIn || !checkOut || !guestInfo) {
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

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setIsLoading(true);
      // Simulate booking creation (replace with Firebase later)
      await new Promise(resolve => setTimeout(resolve, 2000));
      const bookingId = 'BK' + Date.now();
      
      toast.success('Booking confirmed!');
      navigate(`/confirmation/${bookingId}`);
    } catch (error: any) {
      toast.error('Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-2">Secure Payment</h2>
          <p className="text-neutral-600 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Your payment information is encrypted and secure
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-8">
              <h4 className="mb-6">Payment Details</h4>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Card Number</label>
                  <input
                    {...register('cardNumber')}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.cardNumber ? 'border-red-300' : 'border-neutral-200'
                    } focus:outline-none focus:ring-2 focus:ring-neutral-900`}
                  />
                  {errors.cardNumber && (
                    <p className="text-xs text-red-600 mt-1">{errors.cardNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Cardholder Name</label>
                  <input
                    {...register('cardName')}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.cardName ? 'border-red-300' : 'border-neutral-200'
                    } focus:outline-none focus:ring-2 focus:ring-neutral-900`}
                  />
                  {errors.cardName && (
                    <p className="text-xs text-red-600 mt-1">{errors.cardName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-700 mb-2">Expiry Date</label>
                    <input
                      {...register('expiryDate')}
                      placeholder="MM/YY"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.expiryDate ? 'border-red-300' : 'border-neutral-200'
                      } focus:outline-none focus:ring-2 focus:ring-neutral-900`}
                    />
                    {errors.expiryDate && (
                      <p className="text-xs text-red-600 mt-1">{errors.expiryDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-700 mb-2">CVV</label>
                    <input
                      {...register('cvv')}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.cvv ? 'border-red-300' : 'border-neutral-200'
                      } focus:outline-none focus:ring-2 focus:ring-neutral-900`}
                    />
                    {errors.cvv && (
                      <p className="text-xs text-red-600 mt-1">{errors.cvv.message}</p>
                    )}
                  </div>
                </div>

                <h5 className="pt-4">Billing Address</h5>

                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Street Address</label>
                  <input
                    {...register('billingAddress')}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.billingAddress ? 'border-red-300' : 'border-neutral-200'
                    } focus:outline-none focus:ring-2 focus:ring-neutral-900`}
                  />
                  {errors.billingAddress && (
                    <p className="text-xs text-red-600 mt-1">{errors.billingAddress.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-700 mb-2">City</label>
                    <input
                      {...register('city')}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.city ? 'border-red-300' : 'border-neutral-200'
                      } focus:outline-none focus:ring-2 focus:ring-neutral-900`}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-700 mb-2">Postal Code</label>
                    <input
                      {...register('postalCode')}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.postalCode ? 'border-red-300' : 'border-neutral-200'
                      } focus:outline-none focus:ring-2 focus:ring-neutral-900`}
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-red-600 mt-1">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Country</label>
                  <input
                    {...register('country')}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.country ? 'border-red-300' : 'border-neutral-200'
                    } focus:outline-none focus:ring-2 focus:ring-neutral-900`}
                  />
                  {errors.country && (
                    <p className="text-xs text-red-600 mt-1">{errors.country.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-neutral-900 text-white py-4 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : `Pay ${formatCurrency(total)}`}
                </button>

                <p className="text-xs text-neutral-500 text-center">
                  By confirming your reservation, you agree to our Terms of Service
                </p>
              </div>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 border border-neutral-100">
              <h5 className="mb-6">Order Summary</h5>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Room</span>
                  <span>{formatCurrency(roomTotal)}</span>
                </div>
                
                {extrasTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Extras</span>
                    <span>{formatCurrency(extrasTotal)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-neutral-600">Fees</span>
                  <span>{formatCurrency(fees)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-600">Taxes</span>
                  <span>{formatCurrency(taxes)}</span>
                </div>
              </div>

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

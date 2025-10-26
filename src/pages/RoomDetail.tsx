import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Star, Users, Maximize2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch } from '../app/hooks';
import { setSelectedRoom, setBookingDates } from '../features/booking/bookingSlice';
import { formatCurrency } from '../utils/formatters';
import { calculateNights, validateRoomAvailability } from '../utils/validators';
import { toast } from 'sonner';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 2);

  // TODO: Replace with Firebase data fetching
  const room = null; // No sample data available
  const isLoading = false;
  const error = 'Room data not available - connect to Firebase';

  const handleBookNow = () => {
    if (!room) return;

    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    const validation = validateRoomAvailability(checkIn, checkOut, guests, room.maxOccupancy);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    dispatch(setSelectedRoom(room));
    dispatch(setBookingDates({ checkIn, checkOut, guests }));
    navigate('/booking');
  };

  const nextImage = () => {
    if (room) {
      setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
    }
  };

  const prevImage = () => {
    if (room) {
      setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="mb-2">Room not found</h3>
          <button
            onClick={() => navigate('/search')}
            className="text-neutral-600 hover:text-neutral-900"
          >
            ← Back to search
          </button>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const totalPrice = nights * room.price;

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <section className="relative h-[60vh] bg-neutral-900">
        <ImageWithFallback
          src={room.images[currentImageIndex]}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation */}
        {room.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {room.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm">
                  {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-neutral-900 text-neutral-900" />
                  <span>{room.rating.toFixed(1)}</span>
                  <span className="text-neutral-500">({room.reviewCount} reviews)</span>
                </div>
              </div>
              
              <h2 className="mb-4">{room.name}</h2>
              
              <div className="flex items-center gap-6 text-neutral-600">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Up to {room.maxOccupancy} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-5 h-5" />
                  <span>{room.size}m²</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h4 className="mb-3">About this room</h4>
              <p className="text-neutral-600 leading-relaxed">{room.description}</p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h4 className="mb-4">Room Features</h4>
              <div className="grid grid-cols-2 gap-3">
                {room.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-neutral-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h4 className="mb-4">Amenities</h4>
              <div className="grid grid-cols-2 gap-3">
                {room.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-neutral-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-neutral-50 rounded-2xl p-8">
              <h4 className="mb-4">House Rules</h4>
              <div className="space-y-3 text-neutral-600">
                <p>• Check-in: 3:00 PM - 11:00 PM</p>
                <p>• Check-out: 11:00 AM</p>
                <p>• No smoking</p>
                <p>• No pets allowed</p>
                <p>• Parties and events not allowed</p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border-2 border-neutral-100 rounded-2xl p-6">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-neutral-900">{formatCurrency(room.price)}</span>
                  <span className="text-neutral-500">/ night</span>
                </div>
                {totalPrice > 0 && (
                  <p className="text-sm text-neutral-600">
                    {formatCurrency(totalPrice)} for {nights} {nights === 1 ? 'night' : 'nights'}
                  </p>
                )}
              </div>

              {/* Date Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Check In</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Check Out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Guests</label>
                  <input
                    type="number"
                    min="1"
                    max={room.maxOccupancy}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              {/* Pricing Breakdown */}
              {totalPrice > 0 && (
                <div className="border-t border-neutral-100 pt-4 mb-6 space-y-2">
                  <div className="flex justify-between text-neutral-600">
                    <span>{formatCurrency(room.price)} × {nights} nights</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Service fee</span>
                    <span>{formatCurrency(25)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Taxes</span>
                    <span>{formatCurrency(totalPrice * 0.1)}</span>
                  </div>
                  <div className="border-t border-neutral-100 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>{formatCurrency(totalPrice + 25 + totalPrice * 0.1)}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleBookNow}
                className="w-full bg-neutral-900 text-white py-3 rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Reserve Now
              </button>

              <p className="text-xs text-neutral-500 text-center mt-4">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

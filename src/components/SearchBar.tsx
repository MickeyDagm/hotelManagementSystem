import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { searchSchema } from '../utils/validators';
import { z } from 'zod';

type SearchFormData = z.infer<typeof searchSchema>;

interface SearchBarProps {
  compact?: boolean;
  defaultValues?: Partial<SearchFormData>;
}

export const SearchBar: React.FC<SearchBarProps> = ({ compact = false, defaultValues }) => {
  const navigate = useNavigate();
  const [focused, setFocused] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: defaultValues || {
      location: 'New York',
      checkIn: '',
      checkOut: '',
      guests: 2,
    },
  });

  const onSubmit = (data: SearchFormData) => {
    const searchParams = new URLSearchParams({
      location: data.location,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: String(data.guests),
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-2 flex items-center gap-2">
          <div className="flex-1 flex items-center px-4 border-r border-neutral-200">
            <MapPin className="w-5 h-5 text-neutral-400 mr-3" />
            <input
              {...register('location')}
              type="text"
              placeholder="Where to?"
              className="w-full py-3 outline-none text-neutral-900 placeholder:text-neutral-400"
            />
          </div>
          
          <div className="flex-1 flex items-center px-4 border-r border-neutral-200">
            <Calendar className="w-5 h-5 text-neutral-400 mr-3" />
            <input
              {...register('checkIn')}
              type="date"
              placeholder="Check in"
              className="w-full py-3 outline-none text-neutral-900"
            />
          </div>
          
          <div className="flex-1 flex items-center px-4 border-r border-neutral-200">
            <Calendar className="w-5 h-5 text-neutral-400 mr-3" />
            <input
              {...register('checkOut')}
              type="date"
              placeholder="Check out"
              className="w-full py-3 outline-none text-neutral-900"
            />
          </div>
          
          <div className="flex items-center px-4">
            <Users className="w-5 h-5 text-neutral-400 mr-3" />
            <input
              {...register('guests', { valueAsNumber: true })}
              type="number"
              min="1"
              max="10"
              placeholder="Guests"
              className="w-20 py-3 outline-none text-neutral-900"
            />
          </div>
          
          <button
            type="submit"
            className="bg-neutral-900 text-white rounded-xl px-8 py-3 hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
        
        {Object.keys(errors).length > 0 && (
          <div className="mt-3 text-sm text-red-600 text-center">
            {Object.values(errors)[0]?.message}
          </div>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Location */}
          <div
            className={`relative ${focused === 'location' ? 'ring-2 ring-neutral-900' : ''} rounded-2xl transition-all`}
            onFocus={() => setFocused('location')}
            onBlur={() => setFocused(null)}
          >
            <div className="p-4 border border-neutral-200 rounded-2xl hover:border-neutral-300 transition-colors">
              <label className="block text-xs text-neutral-500 mb-1">Location</label>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-neutral-400 mr-2" />
                <input
                  {...register('location')}
                  type="text"
                  placeholder="Where are you going?"
                  className="w-full outline-none text-neutral-900 placeholder:text-neutral-400"
                />
              </div>
            </div>
            {errors.location && (
              <p className="absolute -bottom-6 left-0 text-xs text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Check In */}
          <div
            className={`relative ${focused === 'checkIn' ? 'ring-2 ring-neutral-900' : ''} rounded-2xl transition-all`}
            onFocus={() => setFocused('checkIn')}
            onBlur={() => setFocused(null)}
          >
            <div className="p-4 border border-neutral-200 rounded-2xl hover:border-neutral-300 transition-colors">
              <label className="block text-xs text-neutral-500 mb-1">Check In</label>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-neutral-400 mr-2" />
                <input
                  {...register('checkIn')}
                  type="date"
                  className="w-full outline-none text-neutral-900"
                />
              </div>
            </div>
            {errors.checkIn && (
              <p className="absolute -bottom-6 left-0 text-xs text-red-600">{errors.checkIn.message}</p>
            )}
          </div>

          {/* Check Out */}
          <div
            className={`relative ${focused === 'checkOut' ? 'ring-2 ring-neutral-900' : ''} rounded-2xl transition-all`}
            onFocus={() => setFocused('checkOut')}
            onBlur={() => setFocused(null)}
          >
            <div className="p-4 border border-neutral-200 rounded-2xl hover:border-neutral-300 transition-colors">
              <label className="block text-xs text-neutral-500 mb-1">Check Out</label>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-neutral-400 mr-2" />
                <input
                  {...register('checkOut')}
                  type="date"
                  className="w-full outline-none text-neutral-900"
                />
              </div>
            </div>
            {errors.checkOut && (
              <p className="absolute -bottom-6 left-0 text-xs text-red-600">{errors.checkOut.message}</p>
            )}
          </div>

          {/* Guests */}
          <div
            className={`relative ${focused === 'guests' ? 'ring-2 ring-neutral-900' : ''} rounded-2xl transition-all`}
            onFocus={() => setFocused('guests')}
            onBlur={() => setFocused(null)}
          >
            <div className="p-4 border border-neutral-200 rounded-2xl hover:border-neutral-300 transition-colors">
              <label className="block text-xs text-neutral-500 mb-1">Guests</label>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-neutral-400 mr-2" />
                <input
                  {...register('guests', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="10"
                  className="w-full outline-none text-neutral-900"
                />
              </div>
            </div>
            {errors.guests && (
              <p className="absolute -bottom-6 left-0 text-xs text-red-600">{errors.guests.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-neutral-900 text-white rounded-2xl py-4 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3"
          >
            <Search className="w-5 h-5" />
            <span>Search Available Rooms</span>
          </button>
        </div>
      </div>
    </form>
  );
};

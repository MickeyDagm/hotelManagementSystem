import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { RoomCard } from '../components/RoomCard';
import { Room } from '../types';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [availableAmenities] = useState<string[]>(['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking', 'Room Service']);
  
  const [filters, setFilters] = useState({
    roomType: 'all',
    minPrice: 0,
    maxPrice: 1000,
    amenities: [] as string[],
  });

  const searchQuery = {
    location: searchParams.get('location') || 'New York',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: Number(searchParams.get('guests')) || 2,
    roomType: filters.roomType,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    amenities: filters.amenities,
    page: 1,
    limit: 20,
  };

  // TODO: Replace with Firebase data fetching
  const rooms: Room[] = []; // No sample data available
  
  const data = {
    rooms: rooms,
    total: rooms.length,
    page: 1,
    totalPages: 1
  };
  
  const isLoading = false;
  const isFetching = false;

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const clearFilters = () => {
    setFilters({
      roomType: 'all',
      minPrice: 0,
      maxPrice: 1000,
      amenities: [],
    });
  };

  const activeFilterCount = 
    (filters.roomType !== 'all' ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 1000 ? 1 : 0) +
    filters.amenities.length;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Search Bar Section */}
      <section className="bg-white border-b border-neutral-100 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SearchBar
            compact
            defaultValues={{
              location: searchQuery.location,
              checkIn: searchQuery.checkIn,
              checkOut: searchQuery.checkOut,
              guests: searchQuery.guests,
            }}
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="mb-2">
              {data?.total || 0} {data?.total === 1 ? 'Room' : 'Rooms'} Available
            </h2>
            <p className="text-neutral-600">
              {searchQuery.checkIn && searchQuery.checkOut
                ? `${searchQuery.checkIn} - ${searchQuery.checkOut}`
                : 'Select dates to see availability'}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-neutral-900 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:block ${
              showFilters ? 'fixed inset-0 bg-black/50 z-50' : 'hidden'
            }`}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowFilters(false);
            }}
          >
            <div
              className={`bg-white h-full lg:h-auto lg:sticky lg:top-24 overflow-y-auto ${
                showFilters ? 'w-80 ml-auto' : ''
              }`}
            >
              <div className="p-6 lg:p-0">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h4>Filters</h4>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-neutral-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Desktop Header */}
                <div className="hidden lg:flex items-center justify-between mb-6">
                  <h4>Filters</h4>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Room Type */}
                <div className="mb-8">
                  <h5 className="mb-4">Room Type</h5>
                  <div className="space-y-2">
                    {['all', 'single', 'double', 'suite', 'deluxe', 'penthouse'].map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="roomType"
                          value={type}
                          checked={filters.roomType === type}
                          onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                          className="w-4 h-4 text-neutral-900 focus:ring-neutral-900"
                        />
                        <span className="text-neutral-700 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h5 className="mb-4">Price Range</h5>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-neutral-600 mb-2 block">
                        Min: ${filters.minPrice}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="50"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-600 mb-2 block">
                        Max: ${filters.maxPrice}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="50"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-8">
                  <h5 className="mb-4">Amenities</h5>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableAmenities.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="w-4 h-4 text-neutral-900 focus:ring-neutral-900 rounded"
                        />
                        <span className="text-neutral-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mobile Apply Button */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-neutral-900 text-white py-3 rounded-xl lg:hidden"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {isLoading || isFetching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-neutral-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-6 bg-neutral-200 rounded" />
                      <div className="h-4 bg-neutral-200 rounded w-3/4" />
                      <div className="h-4 bg-neutral-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data && data.rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    checkIn={searchQuery.checkIn}
                    checkOut={searchQuery.checkOut}
                    guests={searchQuery.guests}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-10 h-10 text-neutral-400" />
                </div>
                <h3 className="mb-2">No rooms found</h3>
                <p className="text-neutral-600 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-neutral-900 text-white px-6 py-3 rounded-xl hover:bg-neutral-800"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

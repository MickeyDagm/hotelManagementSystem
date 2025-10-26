import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Maximize2, Star } from 'lucide-react';
import { Room } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

interface RoomCardProps {
  room: Room;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, checkIn, checkOut, guests }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', String(guests));
    
    navigate(`/room/${room.id}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-neutral-100"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={room.images[0]}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
            {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
          </div>
        </div>

        {/* Rating */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-neutral-900 text-neutral-900" />
            <span className="text-sm">{room.rating.toFixed(1)}</span>
            <span className="text-xs text-neutral-500">({room.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-2">{room.name}</h3>
        
        <p className="text-neutral-600 mb-4 line-clamp-2">
          {room.description}
        </p>

        {/* Features */}
        <div className="flex items-center gap-4 mb-4 text-sm text-neutral-600">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>Up to {room.maxOccupancy} guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4" />
            <span>{room.size}m²</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="text-xs bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-xs text-neutral-500 px-3 py-1">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between pt-4 border-t border-neutral-100">
          <div>
            <p className="text-sm text-neutral-500">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-neutral-900">{formatCurrency(room.price)}</span>
              <span className="text-sm text-neutral-500">/ night</span>
            </div>
          </div>
          
          <button className="bg-neutral-900 text-white px-6 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

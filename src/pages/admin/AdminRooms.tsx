import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, Maximize2 } from 'lucide-react';

export const AdminRooms: React.FC = () => {
  const [rooms] = useState([
    {
      id: '1',
      name: 'Deluxe Ocean View Suite',
      type: 'Suite',
      capacity: 4,
      size: 65,
      price: 299,
      status: 'available',
      amenities: ['Ocean View', 'Balcony', 'Mini Bar', 'WiFi'],
      image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYwOTM1NDM1fDA&ixlib=rb-4.1.0&q=80&w=400'
    },
    {
      id: '2',
      name: 'Executive Business Suite',
      type: 'Suite',
      capacity: 2,
      size: 45,
      price: 229,
      status: 'occupied',
      amenities: ['City View', 'Work Desk', 'WiFi', 'Coffee Machine'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYwOTM1NDM1fDA&ixlib=rb-4.1.0&q=80&w=400'
    },
    {
      id: '3',
      name: 'Standard Double Room',
      type: 'Standard',
      capacity: 2,
      size: 30,
      price: 149,
      status: 'maintenance',
      amenities: ['WiFi', 'TV', 'Air Conditioning'],
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYwOTM1NDM1fDA&ixlib=rb-4.1.0&q=80&w=400'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
            <p className="mt-2 text-gray-600">Manage hotel rooms and availability</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Room
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">All Types</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">Any Capacity</option>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{room.type}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">{room.capacity} guests</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Maximize2 className="h-4 w-4 mr-1" />
                    <span className="text-sm">{room.size} m²</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">${room.price}</span>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

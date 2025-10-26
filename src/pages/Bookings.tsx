import React from 'react';
import { Calendar, MapPin, Users, Clock, CreditCard } from 'lucide-react';
import { useAppSelector } from '../app/hooks';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Bookings: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  // Mock bookings data - in a real app, this would come from an API
  const mockBookings = [
    {
      id: '1',
      roomName: 'Deluxe Ocean View Suite',
      hotelName: 'Grand Seaside Resort',
      checkIn: '2024-03-15',
      checkOut: '2024-03-18',
      guests: 2,
      totalAmount: 899.97,
      status: 'confirmed',
      bookingDate: '2024-02-20',
      image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYwOTM1NDM1fDA&ixlib=rb-4.1.0&q=80&w=400'
    },
    {
      id: '2',
      roomName: 'Executive Business Suite',
      hotelName: 'Metropolitan Hotel',
      checkIn: '2024-04-10',
      checkOut: '2024-04-12',
      guests: 1,
      totalAmount: 459.98,
      status: 'pending',
      bookingDate: '2024-03-01',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYwOTM1NDM1fDA&ixlib=rb-4.1.0&q=80&w=400'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">Manage your hotel reservations</p>
        </div>

        {mockBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't made any bookings yet. Start exploring our hotels!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {mockBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-48 h-48 md:h-auto">
                    <img
                      src={booking.image}
                      alt={booking.roomName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {booking.roomName}
                        </h3>
                        <p className="text-gray-600 mt-1">{booking.hotelName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-2" />
                        <span>{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>Booked on {formatDate(booking.bookingDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <CreditCard className="h-5 w-5 mr-2" />
                        <span className="font-semibold">{formatCurrency(booking.totalAmount)}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                      {booking.status === 'confirmed' && (
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                          Modify Booking
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

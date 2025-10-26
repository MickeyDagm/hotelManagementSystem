import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, Shield, HeadphonesIcon } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { RoomCard } from '../components/RoomCard';
import { RoomService } from '../services/firestoreService';
import { Room } from '../types';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export const Home: React.FC = () => {
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        const rooms = await RoomService.getAvailableRooms();
        // Get top 3 rooms by rating
        const sortedRooms = rooms.sort((a, b) => b.rating - a.rating).slice(0, 3);
        setFeaturedRooms(sortedRooms);
      } catch (error) {
        console.error('Error fetching featured rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRooms();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2MDkzNTQzNXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Luxury Hotel Lobby"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-white mb-6">
            Discover Your Perfect Stay
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Experience unparalleled luxury and comfort in our handpicked selection of premium accommodations
          </p>

          {/* Search Bar */}
          <SearchBar />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Why Choose LuxeStay</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              We're committed to providing exceptional experiences that exceed your expectations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Star,
                title: 'Premium Quality',
                description: 'Handpicked rooms that meet the highest standards of luxury and comfort',
              },
              {
                icon: Award,
                title: 'Best Price Guarantee',
                description: 'We guarantee the best rates for your booking, always',
              },
              {
                icon: Shield,
                title: 'Secure Booking',
                description: 'Your data is protected with enterprise-level security',
              },
              {
                icon: HeadphonesIcon,
                title: '24/7 Support',
                description: 'Our dedicated team is here to help you anytime, anywhere',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="mb-3">{feature.title}</h4>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="mb-4">Featured Rooms</h2>
              <p className="text-neutral-600">
                Explore our most popular accommodations
              </p>
            </div>
            <Link
              to="/search"
              className="hidden md:block text-neutral-900 hover:text-neutral-700 transition-colors"
            >
              View all rooms →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-neutral-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-neutral-200 rounded" />
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-4 bg-neutral-200 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              featuredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))
            )}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link
              to="/search"
              className="inline-block bg-neutral-900 text-white px-8 py-3 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-white mb-6">
                Experience Luxury Like Never Before
              </h2>
              <p className="text-white/80 mb-8">
                From the moment you step into our properties, you'll be immersed in an atmosphere of refined elegance and thoughtful hospitality. Every detail has been carefully curated to ensure your stay is nothing short of extraordinary.
              </p>
              <div className="space-y-4">
                {[
                  'Personalized concierge service',
                  'World-class amenities',
                  'Prime locations in major cities',
                  'Exclusive member benefits',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <span className="text-white/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYwOTcyNDE1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Hotel Room"
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1663659506588-5d5f24c3eb4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJhdGhyb29tJTIwbHV4dXJ5fGVufDF8fHx8MTc2MDk0Njg1NXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Hotel Bathroom"
                  className="w-full h-48 object-cover rounded-2xl"
                />
              </div>
              <div className="space-y-4 pt-8">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1709630998478-7c310df16bc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwOTIzNjMzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Hotel Interior"
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1570213489059-0aac6626cade?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHBvb2wlMjByZXNvcnR8ZW58MXx8fHwxNzYxMDE5Mzc4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Hotel Pool"
                  className="w-full h-64 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="mb-6">Ready to Book Your Stay?</h2>
          <p className="text-neutral-600 mb-8 text-xl">
            Join thousands of satisfied guests who have experienced the LuxeStay difference
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/search"
              className="bg-neutral-900 text-white px-8 py-4 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Browse Available Rooms
            </Link>
            <Link
              to="/contact"
              className="border-2 border-neutral-900 text-neutral-900 px-8 py-4 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

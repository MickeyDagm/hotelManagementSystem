import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, Shield, HeadphonesIcon, Users, MapPin, Calendar, Heart } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2MDkzNTQzNXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Luxury Hotel About"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-white mb-6">
            About LuxeStay
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Redefining luxury hospitality with exceptional service, premium accommodations, and unforgettable experiences since 2010
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="mb-6">Our Story</h2>
              <p className="text-neutral-600 mb-6 text-lg">
                Founded in 2010 with a vision to transform the hospitality industry, LuxeStay began as a boutique hotel collection focused on providing personalized luxury experiences. What started as a single property has grown into a curated network of premium accommodations across major destinations worldwide.
              </p>
              <p className="text-neutral-600 mb-8">
                Our commitment to excellence, attention to detail, and passion for hospitality has earned us recognition as one of the leading luxury hotel brands. We believe that every guest deserves an extraordinary experience, and we work tirelessly to exceed expectations at every touchpoint.
              </p>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-neutral-900 mb-2">150+</div>
                  <div className="text-neutral-600">Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-neutral-900 mb-2">50+</div>
                  <div className="text-neutral-600">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-neutral-900 mb-2">1M+</div>
                  <div className="text-neutral-600">Happy Guests</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2MDkzNTQzNXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Hotel Lobby"
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHNlcnZpY2V8ZW58MXx8fHwxNzYwOTM1NDM1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Hotel Service"
                  className="w-full h-48 object-cover rounded-2xl"
                />
              </div>
              <div className="space-y-4 pt-8">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGRpbmluZ3xlbnwxfHx8fDE3NjA5MzU0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Hotel Dining"
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYwOTM1NDM1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Luxury Room"
                  className="w-full h-64 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Our Values</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              The principles that guide everything we do and shape every guest experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Star,
                title: 'Excellence',
                description: 'We strive for perfection in every detail, from room amenities to personalized service',
              },
              {
                icon: Heart,
                title: 'Hospitality',
                description: 'Genuine care and warmth in every interaction, making guests feel truly welcomed',
              },
              {
                icon: Shield,
                title: 'Integrity',
                description: 'Honest, transparent practices that build trust and lasting relationships',
              },
              {
                icon: Award,
                title: 'Innovation',
                description: 'Continuously evolving to exceed expectations and set new industry standards',
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="mb-3">{value.title}</h4>
                  <p className="text-neutral-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Leadership Team</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Meet the visionaries behind LuxeStay's success and commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Chief Executive Officer',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbnxlbnwxfHx8fDE3NjA5MzU0MzV8MA&ixlib=rb-4.1.0&q=80&w=400',
                bio: '15+ years in luxury hospitality, former VP at Four Seasons'
              },
              {
                name: 'Michael Chen',
                role: 'Chief Operating Officer',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW58ZW58MXx8fHwxNzYwOTM1NDM1fDA&ixlib=rb-4.1.0&q=80&w=400',
                bio: 'Operations expert with 20+ years in international hotel management'
              },
              {
                name: 'Emily Rodriguez',
                role: 'Chief Experience Officer',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbnxlbnwxfHx8fDE3NjA5MzU0MzV8MA&ixlib=rb-4.1.0&q=80&w=400',
                bio: 'Guest experience innovator, former Director at Ritz-Carlton'
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 overflow-hidden rounded-2xl">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="mb-2">{member.name}</h4>
                <p className="text-neutral-600 font-medium mb-3">{member.role}</p>
                <p className="text-neutral-500 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-white mb-4">Awards & Recognition</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Our commitment to excellence has been recognized by industry leaders worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                year: '2024',
                award: 'Best Luxury Hotel Chain',
                organization: 'Travel + Leisure'
              },
              {
                year: '2023',
                award: 'Excellence in Service',
                organization: 'Condé Nast Traveler'
              },
              {
                year: '2023',
                award: 'Top Hotel Brand',
                organization: 'World Travel Awards'
              },
              {
                year: '2022',
                award: 'Innovation in Hospitality',
                organization: 'Hotel Management'
              }
            ].map((award, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="text-white/60 text-sm mb-2">{award.year}</div>
                <h4 className="text-white mb-2">{award.award}</h4>
                <p className="text-white/80 text-sm">{award.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="mb-6">Experience the LuxeStay Difference</h2>
          <p className="text-neutral-600 mb-8 text-xl">
            Join our community of discerning travelers and discover what makes us special
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/search"
              className="bg-neutral-900 text-white px-8 py-4 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Book Your Stay
            </Link>
            <Link
              to="/contact"
              className="border-2 border-neutral-900 text-neutral-900 px-8 py-4 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

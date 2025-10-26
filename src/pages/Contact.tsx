import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, HeadphonesIcon, Globe } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  inquiryType: z.string().min(1, 'Please select an inquiry type')
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Contact form submitted:', data);
    toast.success('Thank you for your message! We\'ll get back to you within 24 hours.');
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGNvbmNpZXJnZXxlbnwxfHx8fDE3NjA5MzU0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Hotel Concierge"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            We're here to help make your stay exceptional. Reach out to us for reservations, inquiries, or any assistance you need
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Contact Information</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Multiple ways to reach us - choose what works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Phone,
                title: 'Phone',
                primary: '+1 (555) 123-LUXE',
                secondary: 'Available 24/7',
                description: 'Speak directly with our reservations team'
              },
              {
                icon: Mail,
                title: 'Email',
                primary: 'hello@luxestay.com',
                secondary: 'Response within 4 hours',
                description: 'Send us your questions or requests'
              },
              {
                icon: MessageSquare,
                title: 'Live Chat',
                primary: 'Available on website',
                secondary: 'Instant responses',
                description: 'Chat with our support team online'
              },
              {
                icon: HeadphonesIcon,
                title: 'Concierge',
                primary: 'In-hotel assistance',
                secondary: 'Personalized service',
                description: 'On-site support during your stay'
              }
            ].map((contact, index) => {
              const Icon = contact.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl hover:shadow-lg transition-shadow text-center"
                >
                  <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="mb-3">{contact.title}</h4>
                  <p className="text-neutral-900 font-semibold mb-1">{contact.primary}</p>
                  <p className="text-neutral-600 text-sm mb-3">{contact.secondary}</p>
                  <p className="text-neutral-500 text-sm">{contact.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Locations */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="mb-6">Send us a Message</h2>
              <p className="text-neutral-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      {...register('inquiryType')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    >
                      <option value="">Select inquiry type</option>
                      <option value="reservation">New Reservation</option>
                      <option value="existing">Existing Booking</option>
                      <option value="group">Group Booking</option>
                      <option value="event">Events & Meetings</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.inquiryType && (
                      <p className="mt-1 text-sm text-red-600">{errors.inquiryType.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    {...register('subject')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="Brief subject of your inquiry"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                    placeholder="Please provide details about your inquiry..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-900 text-white px-8 py-4 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Office Locations */}
            <div>
              <h2 className="mb-6">Our Locations</h2>
              <p className="text-neutral-600 mb-8">
                Visit us at our offices around the world or contact our regional teams directly.
              </p>

              <div className="space-y-8">
                {[
                  {
                    city: 'New York',
                    country: 'United States',
                    address: '123 Fifth Avenue, Suite 1500\nNew York, NY 10001',
                    phone: '+1 (555) 123-4567',
                    email: 'ny@luxestay.com',
                    hours: 'Mon-Fri: 9AM-6PM EST',
                    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eXxlbnwxfHx8fDE3NjA5MzU0MzV8MA&ixlib=rb-4.1.0&q=80&w=400'
                  },
                  {
                    city: 'London',
                    country: 'United Kingdom',
                    address: '45 Park Lane, Mayfair\nLondon W1K 1PN',
                    phone: '+44 20 7123 4567',
                    email: 'london@luxestay.com',
                    hours: 'Mon-Fri: 9AM-6PM GMT',
                    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBjaXR5fGVufDF8fHx8MTc2MDkzNTQzNXww&ixlib=rb-4.1.0&q=80&w=400'
                  },
                  {
                    city: 'Tokyo',
                    country: 'Japan',
                    address: '1-1-1 Shibuya, Shibuya-ku\nTokyo 150-0002',
                    phone: '+81 3 1234 5678',
                    email: 'tokyo@luxestay.com',
                    hours: 'Mon-Fri: 9AM-6PM JST',
                    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHl8ZW58MXx8fHwxNzYwOTM1NDM1fDA&ixlib=rb-4.1.0&q=80&w=400'
                  }
                ].map((location, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={location.image}
                          alt={location.city}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-2">{location.city}, {location.country}</h4>
                        <div className="space-y-2 text-sm text-neutral-600">
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="whitespace-pre-line">{location.address}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{location.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{location.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{location.hours}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Frequently Asked Questions</h2>
            <p className="text-neutral-600">
              Quick answers to common questions about our services
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'What is your cancellation policy?',
                answer: 'We offer flexible cancellation policies that vary by rate and property. Most bookings can be cancelled up to 24-48 hours before arrival without penalty. Please check your specific booking terms for details.'
              },
              {
                question: 'Do you offer group booking discounts?',
                answer: 'Yes, we provide special rates for group bookings of 10 or more rooms. Contact our group sales team for customized packages and pricing.'
              },
              {
                question: 'Are pets allowed at your properties?',
                answer: 'Pet policies vary by property. Many of our hotels are pet-friendly with additional fees. Please contact the specific property or our reservations team for pet policy details.'
              },
              {
                question: 'What amenities are included in my stay?',
                answer: 'Amenities vary by property and room type but typically include complimentary WiFi, fitness center access, and concierge services. Premium rooms may include additional perks like breakfast, lounge access, and spa credits.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl">
                <h4 className="mb-3">{faq.question}</h4>
                <p className="text-neutral-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="mb-6">Ready to Experience LuxeStay?</h2>
          <p className="text-neutral-600 mb-8 text-xl">
            Don't hesitate to reach out - we're here to make your stay unforgettable
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+15551234567"
              className="bg-neutral-900 text-white px-8 py-4 rounded-xl hover:bg-neutral-800 transition-colors flex items-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </a>
            <a
              href="mailto:hello@luxestay.com"
              className="border-2 border-neutral-900 text-neutral-900 px-8 py-4 rounded-xl hover:bg-neutral-50 transition-colors flex items-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              Send Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

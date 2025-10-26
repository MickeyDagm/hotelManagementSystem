import React from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { setUser } from '../features/auth/authSlice';
import { formatDate } from '../utils/formatters';
import { toast } from 'sonner';

export const Profile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = (data: any) => {
    if (user) {
      dispatch(setUser({ ...user, ...data }));
      toast.success('Profile updated successfully');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h2 className="mb-8">My Profile</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <h4 className="mb-1">
                {user.firstName} {user.lastName}
              </h4>
              <p className="text-neutral-600 mb-4">{user.email}</p>
              <div className="inline-block bg-neutral-100 px-4 py-1.5 rounded-full text-sm">
                {user.role === 'admin' ? 'Administrator' : 'Guest'}
              </div>
              <div className="mt-6 pt-6 border-t border-neutral-100 text-sm text-neutral-600">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {formatDate(user.createdAt, 'short')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8">
              <h4 className="mb-6">Personal Information</h4>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-700 mb-2">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        {...register('firstName')}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-700 mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        {...register('lastName')}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-neutral-900 text-white py-3 rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Save Changes
                </button>
              </form>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-2xl p-8 mt-8">
              <h4 className="mb-4">Security</h4>
              <p className="text-neutral-600 mb-6">
                Update your password to keep your account secure
              </p>
              <button className="border-2 border-neutral-900 text-neutral-900 px-6 py-3 rounded-xl hover:bg-neutral-50 transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

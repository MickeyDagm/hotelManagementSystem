import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signupSchema } from '../utils/validators';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { signupUser, clearError } from '../features/auth/authSlice';
import { toast } from 'sonner';
import { z } from 'zod';

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const result = await dispatch(signupUser(data)).unwrap();
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">L</span>
            </div>
          </Link>
          <h2 className="mb-2">Create Account</h2>
          <p className="text-neutral-600">Join LuxeStay and start your journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="firstName" className="block text-sm text-neutral-700 mb-2">
                First Name
              </label>
              <input
                {...register('firstName')}
                id="firstName"
                type="text"
                placeholder="Abebe"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.firstName ? 'border-red-300' : 'border-neutral-200'
                } focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm text-neutral-700 mb-2">
                Last Name
              </label>
              <input
                {...register('lastName')}
                id="lastName"
                type="text"
                placeholder="Kebede"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.lastName ? 'border-red-300' : 'border-neutral-200'
                } focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all`}
              />
              {errors.lastName && (
                <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm text-neutral-700 mb-2">
              Email Address
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="you@gmail.com"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.email ? 'border-red-300' : 'border-neutral-200'
              } focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all`}
            />
            {errors.email && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email.message}</span>
              </div>
            )}
          </div>

          {/* Phone (Optional) */}
          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm text-neutral-700 mb-2">
              Phone Number <span className="text-neutral-400">(Optional)</span>
            </label>
            <input
              {...register('phone')}
              id="phone"
              type="tel"
              placeholder="+251-9*******"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm text-neutral-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.password ? 'border-red-300' : 'border-neutral-200'
                } focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.password.message}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm text-neutral-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-neutral-200'
                } focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.confirmPassword.message}</span>
              </div>
            )}
          </div>

          {/* Terms */}
          <p className="text-xs text-neutral-600 mb-6">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-neutral-900 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-neutral-900 hover:underline">
              Privacy Policy
            </Link>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white py-3 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-neutral-600">
          Already have an account?{' '}
          <Link to="/login" className="text-neutral-900 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

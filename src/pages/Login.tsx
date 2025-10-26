import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { loginSchema } from '../utils/validators';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginUser, clearError } from '../features/auth/authSlice';
import { toast } from 'sonner';
import { z } from 'zod';

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated && user) {
      // Role-based redirection
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'manager') {
        navigate('/manager/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success('Welcome back!');
      // Redirection is handled by useEffect based on user role
    } catch (error: any) {
      toast.error(error || 'Login failed');
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
          <h2 className="mb-2">Welcome Back</h2>
          <p className="text-neutral-600">Sign in to your account to continue</p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-900 mb-2">Demo Credentials:</p>
          <div className="text-xs text-blue-800 space-y-1">
            <p><strong>Customer:</strong> user1@example.com / password123</p>
            <p><strong>Manager:</strong> manager@hotel.com / manager123</p>
            <p><strong>Admin:</strong> admin@hotel.com / admin123</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm text-neutral-700 mb-2">
              Email Address
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="you@example.com"
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

          {/* Password */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm text-neutral-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-neutral-600 hover:text-neutral-900">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white py-3 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-neutral-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-neutral-900 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

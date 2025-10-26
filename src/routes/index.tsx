import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Pages
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { SearchResults } from '../pages/SearchResults';
import { RoomDetail } from '../pages/RoomDetail';
import { BookingFlow } from '../pages/BookingFlow';
import { Checkout } from '../pages/Checkout';
import { BookingConfirmation } from '../pages/BookingConfirmation';
import { Profile } from '../pages/Profile';
import { Bookings } from '../pages/Bookings';
import { AdminDashboard } from '../pages/AdminDashboard';
import { ManagerDashboard } from '../pages/ManagerDashboard';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with Main Layout (Header + Footer) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="room/:id" element={<RoomDetail />} />
          
          {/* Protected Routes with Main Layout */}
          <Route
            path="booking"
            element={
              <ProtectedRoute>
                <BookingFlow />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="confirmation/:bookingId"
            element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Routes without Main Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Routes (no Header/Footer) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute requireManager>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Middleware route guard
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages (Protected)
import Uhome from './pages/Uhome';
import Cabs from './pages/Cabs';
import BookCab from './pages/BookCab';
import MyBookings from './pages/MyBookings';
import PaymentSim from './pages/PaymentSim';
import Profile from './pages/Profile';

// Admin Pages (Protected/Admin)
import Alogin from './pages/Alogin';
import Aregister from './pages/Aregister';
import Ahome from './pages/Ahome';
import Users from './pages/Users';
import UserEdit from './pages/UserEdit';
import Bookings from './pages/Bookings';
import Acabs from './pages/Acabs';
import Acabedit from './pages/Acabedit';
import Addcar from './pages/Addcar';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          {/* Global Hot Toast Notification Component */}
          <Toaster position="top-center" reverseOrder={false} />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Unified Admin Logins */}
            <Route path="/admin/login" element={<Alogin />} />
            <Route path="/admin/register" element={<Aregister />} />

            {/* Protected Customer Routes */}
            <Route
              path="/uhome"
              element={
                <ProtectedRoute allowedRoles={['user', 'driver']}>
                  <Uhome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cabs"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <Cabs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-cab"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <BookCab />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute allowedRoles={['user', 'driver']}>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-gateway-sim"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <PaymentSim />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin-Only Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Ahome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cabs"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Acabs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cabs/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Acabedit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-car"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Addcar />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

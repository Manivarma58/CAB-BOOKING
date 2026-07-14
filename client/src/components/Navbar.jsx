import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Car, User as UserIcon, LogOut, LayoutDashboard, History, Calendar, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-primary text-white shadow-md shadow-primary/20'
        : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const mobileLinkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-primary text-white'
        : 'text-slate-650 hover:bg-slate-100'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Branding */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? (user?.role === 'admin' ? '/admin/dashboard' : '/uhome') : '/'} className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30">
                <Car className="h-6 w-6 text-white stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                U<span className="text-secondary">Cab</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center gap-1">
              {!isAuthenticated ? (
                <>
                  <Link to="/" className={linkClass('/')}>
                    Home
                  </Link>
                  <Link to="/login" className="ml-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition">
                    Log In
                  </Link>
                  <Link to="/register" className="ml-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition shadow-sm">
                    Sign Up
                  </Link>
                </>
              ) : user?.role === 'admin' ? (
                // Admin Navigation
                <>
                  <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link to="/admin/users" className={linkClass('/admin/users')}>
                    <UserIcon className="h-4 w-4" />
                    Users
                  </Link>
                  <Link to="/admin/cabs" className={linkClass('/admin/cabs')}>
                    <Car className="h-4 w-4" />
                    Cabs
                  </Link>
                  <Link to="/admin/add-car" className={linkClass('/admin/add-car')}>
                    <PlusCircle className="h-4 w-4" />
                    Add Cab
                  </Link>
                  <Link to="/admin/bookings" className={linkClass('/admin/bookings')}>
                    <Calendar className="h-4 w-4" />
                    Bookings
                  </Link>
                </>
              ) : (
                // User Navigation
                <>
                  <Link to="/uhome" className={linkClass('/uhome')}>
                    <LayoutDashboard className="h-4 w-4" />
                    Home
                  </Link>
                  <Link to="/cabs" className={linkClass('/cabs')}>
                    <Car className="h-4 w-4" />
                    Book Cab
                  </Link>
                  <Link to="/bookings" className={linkClass('/bookings')}>
                    <History className="h-4 w-4" />
                    My Bookings
                  </Link>
                  <Link to="/profile" className={linkClass('/profile')}>
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User profile dropdown info & logout (Desktop) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage.startsWith('/') ? `http://localhost:8000${user.profileImage}` : user.profileImage}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/50"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="text-left leading-tight">
                  <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                  <p className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">{user.name}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-slate-500 hover:text-red-600 transition duration-150 py-2"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Log out</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-2 pt-2 pb-4 space-y-1 shadow-inner animate-in slide-in-from-top duration-200">
          {!isAuthenticated ? (
            <>
              <Link to="/" onClick={() => setIsOpen(false)} className={mobileLinkClass('/')}>
                Home
              </Link>
              <div className="grid grid-cols-2 gap-2 mt-4 px-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center rounded-lg border border-slate-300 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center rounded-lg bg-primary py-2.5 text-center text-sm font-medium text-white hover:bg-primary-dark"
                >
                  Sign Up
                </Link>
              </div>
            </>
          ) : user?.role === 'admin' ? (
            <>
              <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin/dashboard')}>
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link to="/admin/users" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin/users')}>
                <UserIcon className="h-5 w-5" />
                Users
              </Link>
              <Link to="/admin/cabs" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin/cabs')}>
                <Car className="h-5 w-5" />
                Cabs
              </Link>
              <Link to="/admin/add-car" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin/add-car')}>
                <PlusCircle className="h-5 w-5" />
                Add Cab
              </Link>
              <Link to="/admin/bookings" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin/bookings')}>
                <Calendar className="h-5 w-5" />
                Bookings
              </Link>
              <div className="border-t border-slate-200 my-2 pt-2 px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 p-2">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/uhome" onClick={() => setIsOpen(false)} className={mobileLinkClass('/uhome')}>
                <LayoutDashboard className="h-5 w-5" />
                Home
              </Link>
              <Link to="/cabs" onClick={() => setIsOpen(false)} className={mobileLinkClass('/cabs')}>
                <Car className="h-5 w-5" />
                Book Cab
              </Link>
              <Link to="/bookings" onClick={() => setIsOpen(false)} className={mobileLinkClass('/bookings')}>
                <History className="h-5 w-5" />
                My Bookings
              </Link>
              <Link to="/profile" onClick={() => setIsOpen(false)} className={mobileLinkClass('/profile')}>
                <UserIcon className="h-5 w-5" />
                Profile
              </Link>
              <div className="border-t border-slate-200 my-2 pt-2 px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">Customer</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 p-2">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

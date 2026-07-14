import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../api';
import Navbar from '../components/Navbar';
import { Car, History, MapPin, Calendar, CreditCard, ChevronRight, Compass, Shield, User, Award, CloudSun } from 'lucide-react';
import toast from 'react-hot-toast';

const Uhome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Weather simulation
  const [temp, setTemp] = useState(30);

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        const res = await bookingAPI.getUserBookings();
        setRecentBookings(res.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentBookings();
    
    // Simple randomized temp between 28 and 34
    setTemp(Math.floor(Math.random() * 6) + 28);
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-amber-50 text-amber-600 border-amber-200/50',
      confirmed: 'bg-indigo-50 text-indigo-650 border-indigo-200/50',
      on_the_way: 'bg-purple-50 text-purple-650 border-purple-200/50',
      completed: 'bg-emerald-50 text-emerald-650 border-emerald-200/50',
      cancelled: 'bg-rose-50 text-rose-650 border-rose-200/50'
    };
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badges[status] || 'bg-slate-50 text-slate-650 border-slate-200'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-lightbg">
      <Navbar />
      
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Welcome Section Banner with Premium Indigo Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-darkbg bg-gradient-primary animate-gradient p-8 text-white shadow-xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-cyan-400 blur-2xl animate-float"></div>
          </div>

          <div className="relative z-10 grid gap-6 md:grid-cols-3 md:items-center">
            <div className="md:col-span-2 text-left space-y-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold text-secondary uppercase tracking-wider border border-white/5">
                Rider Dashboard
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Hello, <span className="text-secondary">{user?.name}</span>!
              </h1>
              <p className="max-w-md text-slate-200 text-sm font-light leading-relaxed">
                Ready to commute? Book a cab to your destination or check your active ride tracking simulator below.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/cabs"
                  className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-xs font-bold text-slate-950 hover:bg-secondary-light transition shadow-md shadow-secondary/20"
                >
                  <Car className="h-4 w-4" /> Book a New Cab
                </Link>
                <Link
                  to="/bookings"
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-xs font-bold text-white border border-white/10 hover:bg-white/20 transition"
                >
                  <History className="h-4 w-4" /> My Bookings
                </Link>
              </div>
            </div>

            {/* Quick Stat widget on the right */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 text-left backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-350">
                  <Award className="h-4 w-4 text-secondary" /> Loyalty Points
                </div>
                <span className="rounded bg-secondary/15 px-2 py-0.5 text-[10px] font-black text-secondary">
                  Gold
                </span>
              </div>
              <div>
                <p className="text-2xl font-black text-white">1,240 pts</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Earn ₹10 reward per 100 points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Widget Panels */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Configure Trip Route</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Compare travel speeds and check real-time routes between Delhi, Noida, and Gurugram.
              </p>
            </div>
            <Link to="/cabs" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
              Browse Cabs <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary mb-4">
                <CloudSun className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Delhi NCR Weather</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Currently {temp}°C with clear skies. Perfect conditions for a comfortable ride.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-slate-400">
              Clear Weather Forecast
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Profile & Settings</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Add profile avatar graphics, coordinate telephone parameters, or adjust notification flags.
              </p>
            </div>
            <Link to="/profile" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
              Go to Profile <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>

        {/* Recent Bookings Section */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Your Recent Rides</h2>
            <Link to="/bookings" className="text-xs font-bold text-primary hover:underline">
              View All Rides
            </Link>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="py-10 text-center text-slate-405">
                <Car className="mx-auto h-12 w-12 text-slate-300 stroke-1 mb-3" />
                <p className="text-xs">You haven't booked any rides yet.</p>
                <Link to="/cabs" className="mt-4 inline-block text-xs font-bold text-primary hover:underline">
                  Book your first ride
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-150">
                {recentBookings.map((b) => (
                  <div key={b._id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between text-left">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800 text-sm">{b.carId?.model || 'Cab Ride'}</p>
                        {getStatusBadge(b.status)}
                      </div>
                      <div className="flex flex-col gap-x-4 gap-y-1 text-xs text-slate-500 sm:flex-row">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" /> {b.pickupLocation} &rarr; {b.dropLocation}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" /> {new Date(b.pickupDate).toLocaleDateString()} at {b.pickupTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div>
                        <p className="text-xs text-slate-400 text-right">Fare</p>
                        <p className="text-base font-black text-slate-900">₹{b.totalFare.toFixed(2)}</p>
                      </div>
                      <Link
                        to={`/bookings?track=${b._id}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Uhome;

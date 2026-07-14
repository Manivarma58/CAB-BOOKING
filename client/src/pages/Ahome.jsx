import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../api';
import Navbar from '../components/Navbar';
import { Users, Calendar, IndianRupee, Car, Eye, Settings, Compass, RefreshCw, BarChart2, PieChart } from 'lucide-react';
import toast from 'react-hot-toast';

const Ahome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalBookings: 0,
    availableCabs: 0,
    totalCabs: 0,
    totalRevenue: 0
  });
  
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [cabTypeStats, setCabTypeStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getDashboardStats();
      setStats(res.data.stats);
      setMonthlyStats(res.data.monthlyStats || []);
      setCabTypeStats(res.data.cabTypeStats || []);
      setRecentActivities(res.data.recentActivities || []);
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-amber-150 text-amber-800',
      confirmed: 'bg-blue-150 text-blue-800',
      on_the_way: 'bg-purple-150 text-purple-800',
      completed: 'bg-emerald-150 text-emerald-800',
      cancelled: 'bg-rose-150 text-rose-800'
    };
    return (
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${badges[status] || 'bg-slate-100 text-slate-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Real-time stats and metrics configuration.</p>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-350 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Users */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between text-left">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Customers</p>
              <p className="text-3xl font-extrabold text-slate-900">{stats.totalUsers}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
          </div>

          {/* Card 2: Bookings */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between text-left">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</p>
              <p className="text-3xl font-extrabold text-slate-900">{stats.totalBookings}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Calendar className="h-6 w-6" />
            </div>
          </div>

          {/* Card 3: Cabs */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between text-left">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Cabs</p>
              <p className="text-3xl font-extrabold text-slate-900">
                {stats.availableCabs} <span className="text-sm font-normal text-slate-450">/ {stats.totalCabs}</span>
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600">
              <Car className="h-6 w-6" />
            </div>
          </div>

          {/* Card 4: Revenue */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between text-left">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
              <p className="text-3xl font-extrabold text-slate-900">₹{stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <IndianRupee className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Charts & Analytics Panel */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          
          {/* Revenue Analytics (SVG Bar Chart) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-yellow-600" /> Revenue & Bookings stats
            </h3>
            
            {loading ? (
              <div className="h-44 flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
              </div>
            ) : monthlyStats.length === 0 ? (
              <div className="h-44 flex items-center justify-center text-slate-400 text-sm">
                No monthly analytics records found.
              </div>
            ) : (
              <div className="space-y-4">
                {/* SVG Chart */}
                <div className="relative h-40 w-full flex items-end justify-between px-2 pt-6 border-b border-slate-200">
                  {monthlyStats.map((item, idx) => {
                    const maxVal = Math.max(...monthlyStats.map((x) => x.revenue)) || 100;
                    const heightPercent = (item.revenue / maxVal) * 80 + 10; // scale between 10% and 90%
                    return (
                      <div key={idx} className="flex flex-col items-center group w-12 relative">
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full mb-1 scale-0 group-hover:scale-100 transition-all bg-slate-950 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap z-10 shadow-md">
                          ₹{item.revenue.toFixed(0)} ({item.bookingsCount} rides)
                        </div>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-8 rounded-t bg-gradient-to-t from-yellow-500 to-amber-400 group-hover:from-yellow-400 group-hover:to-amber-300 transition-all duration-300"
                        ></div>
                        <span className="text-[10px] text-slate-400 mt-2 font-semibold">M {item._id}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-400 text-center">X-Axis represents Months (1-12) | Y-Axis displays Fares revenue</p>
              </div>
            )}
          </div>

          {/* Popular Cab Types (SVG Donut Chart / Progress Bar Distribution) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-yellow-600" /> Popular Cab Demographics
            </h3>

            {loading ? (
              <div className="h-44 flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
              </div>
            ) : cabTypeStats.length === 0 ? (
              <div className="h-44 flex items-center justify-center text-slate-400 text-sm">
                No active bookings records to categorize.
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {cabTypeStats.map((item, idx) => {
                  const maxCount = Math.max(...cabTypeStats.map((x) => x.count)) || 1;
                  const percent = (item.count / maxCount) * 100;
                  const colorClass = [
                    'bg-yellow-500',
                    'bg-blue-500',
                    'bg-purple-500',
                    'bg-emerald-500',
                    'bg-rose-500'
                  ][idx % 5];

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{item._id}</span>
                        <span className="text-slate-500">{item.count} rides</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-full rounded-full ${colorClass}`}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Panel Links */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link
            to="/admin/users"
            className="flex items-center justify-between rounded-2xl border border-slate-250 bg-white p-5 shadow-sm hover:bg-slate-50/50 transition text-left"
          >
            <div>
              <p className="font-extrabold text-slate-800">Manage Customers</p>
              <p className="text-xs text-slate-450 mt-0.5">Edit credentials or delete users</p>
            </div>
            <Users className="h-5 w-5 text-slate-400" />
          </Link>
          
          <Link
            to="/admin/cabs"
            className="flex items-center justify-between rounded-2xl border border-slate-250 bg-white p-5 shadow-sm hover:bg-slate-50/50 transition text-left"
          >
            <div>
              <p className="font-extrabold text-slate-800">Manage Cabs</p>
              <p className="text-xs text-slate-450 mt-0.5">Register, edit or toggle vehicles</p>
            </div>
            <Car className="h-5 w-5 text-slate-400" />
          </Link>

          <Link
            to="/admin/bookings"
            className="flex items-center justify-between rounded-2xl border border-slate-250 bg-white p-5 shadow-sm hover:bg-slate-50/50 transition text-left"
          >
            <div>
              <p className="font-extrabold text-slate-800">Oversee Bookings</p>
              <p className="text-xs text-slate-450 mt-0.5">Change statuses or review history</p>
            </div>
            <Calendar className="h-5 w-5 text-slate-400" />
          </Link>
        </div>

        {/* Recent Activities list */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-left">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Recent Ride Operations
          </h3>

          <div>
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
              </div>
            ) : recentActivities.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-10">No recent activities on this server.</p>
            ) : (
              <div className="divide-y divide-slate-150">
                {recentActivities.map((act) => (
                  <div key={act._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{act.userId?.name || 'Deleted User'}</span>
                        <span className="text-slate-400 text-xs">booked</span>
                        <span className="font-semibold text-slate-700">{act.carId?.model || 'Cab'}</span>
                        {getStatusBadge(act.status)}
                      </div>
                      <p className="text-xs text-slate-450">
                        Route: {act.pickupLocation} &rarr; {act.dropLocation}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-950">${act.totalFare.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400">{new Date(act.createdAt).toLocaleString()}</p>
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

export default Ahome;

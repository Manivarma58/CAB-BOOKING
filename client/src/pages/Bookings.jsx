import React, { useState, useEffect } from 'react';
import { adminAPI, bookingAPI } from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Search, Calendar, MapPin, DollarSign, RefreshCw, SlidersHorizontal, ArrowLeft, Clock } from 'lucide-react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, nextStatus) => {
    try {
      await bookingAPI.updateStatus(bookingId, nextStatus);
      toast.success(`Booking status changed to ${nextStatus}`);
      fetchBookings();
    } catch (err) {
      console.error('Update booking status failed:', err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userId?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.carId?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statuses = ['All', 'pending', 'confirmed', 'on_the_way', 'completed', 'cancelled'];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      on_the_way: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-rose-100 text-rose-800 border-rose-200'
    };
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${badges[status] || 'bg-slate-100 text-slate-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 text-left">
          <div>
            <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700">
              <ArrowLeft className="h-3 w-3" /> Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Manage Bookings</h1>
            <p className="text-slate-500 text-sm">Review global operations, update status coordinates, or check fares.</p>
          </div>
          
          <button onClick={fetchBookings} className="flex self-start items-center gap-1.5 rounded-xl border border-slate-350 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3 mb-6 text-left">
          {/* Search bar */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
              placeholder="Search by customer, cab model or ID..."
            />
          </div>

          {/* Status dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-yellow-500 focus:outline-none bg-white"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Statuses' : s.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bookings Table List */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden text-left">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Calendar className="mx-auto h-16 w-16 stroke-1 text-slate-300 mb-3" />
              <p className="font-semibold text-slate-700">No bookings matching criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] table-auto border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase text-slate-400">
                    <th className="pb-3 text-left">Booking ID</th>
                    <th className="pb-3 text-left">Customer Details</th>
                    <th className="pb-3 text-left">Vehicle Model</th>
                    <th className="pb-3 text-left">Route coordinates</th>
                    <th className="pb-3 text-left">Timings / Date</th>
                    <th className="pb-3 text-left">Amount</th>
                    <th className="pb-3 text-left">Status Badge</th>
                    <th className="pb-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 font-mono text-xs text-slate-400">{b._id.slice(-8)}</td>
                      <td className="py-4">
                        <div className="font-bold text-slate-800">{b.userId?.name || 'Deleted User'}</div>
                        <div className="text-xs text-slate-450 mt-0.5">{b.userId?.email}</div>
                      </td>
                      <td className="py-4">
                        <div className="font-semibold text-slate-800">{b.carId?.model || 'Deleted Cab'}</div>
                        <div className="font-mono text-xs text-slate-400 uppercase mt-0.5">{b.carId?.carNumber}</div>
                      </td>
                      <td className="py-4 text-slate-650">
                        <div className="truncate max-w-[120px]" title={b.pickupLocation}>{b.pickupLocation}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[120px] mt-0.5" title={b.dropLocation}>
                          &rarr; {b.dropLocation}
                        </div>
                      </td>
                      <td className="py-4 text-slate-650">
                        <div>{new Date(b.pickupDate).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{b.pickupTime}</div>
                      </td>
                      <td className="py-4 font-black text-slate-900">₹{b.totalFare.toFixed(2)}</td>
                      <td className="py-4">{getStatusBadge(b.status)}</td>
                      <td className="py-4 text-right">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                          className="rounded-lg border border-slate-350 bg-slate-50 px-2 py-1 text-xs focus:outline-none focus:border-yellow-500 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="on_the_way">On The Way</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Bookings;

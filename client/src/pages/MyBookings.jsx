import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingAPI } from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { MapPin, Calendar, Clock, Car, Trash2, Map, Compass, Navigation, RefreshCw } from 'lucide-react';

let socket;

const MyBookings = () => {
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTrackBooking, setActiveTrackBooking] = useState(null);
  
  // Real-time tracking simulated state
  const [driverLoc, setDriverLoc] = useState({ lat: 37.7749, lng: -122.4194 });
  const [simulationProgress, setSimulationProgress] = useState(0); // 0 to 100%
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getUserBookings();
      setBookings(res.data);
      
      // Auto-select a booking if passed via URL tracking param
      const trackId = searchParams.get('track');
      if (trackId) {
        const toTrack = res.data.find((b) => b._id === trackId);
        if (toTrack) {
          handleSelectTrack(toTrack);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    
    // Connect to Socket.io backend
    socket = io(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8000');

    socket.on('connect', () => {
      console.log('Socket client connected to backend');
    });

    // Listen for live booking updates
    socket.on('bookingUpdated', (updatedBooking) => {
      setBookings((prev) =>
        prev.map((b) => (b._id === updatedBooking._id ? { ...b, status: updatedBooking.status } : b))
      );
      
      setActiveTrackBooking((prev) => {
        if (prev && prev._id === updatedBooking._id) {
          return { ...prev, status: updatedBooking.status };
        }
        return prev;
      });
      toast.success(`Booking status changed to: ${updatedBooking.status.replace('_', ' ')}`);
    });

    // Listen for driver location coords
    socket.on('locationUpdate', (coords) => {
      setDriverLoc(coords);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [searchParams]);

  const handleSelectTrack = (booking) => {
    setActiveTrackBooking(booking);
    setSimulationProgress(0);
    setIsSimulating(false);
    
    // Join the specific room for updates
    if (socket) {
      socket.emit('joinBooking', { bookingId: booking._id });
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await bookingAPI.cancel(id);
      toast.success('Booking cancelled successfully.');
      fetchBookings();
      if (activeTrackBooking?._id === id) {
        setActiveTrackBooking(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Simulate local driver tracking movement
  const startLocalSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationProgress(0);

    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          // Auto complete status
          if (socket) {
            socket.emit('rideStatusChange', { bookingId: activeTrackBooking._id, status: 'completed' });
          }
          return 100;
        }
        
        // Emit coordinates mock updates
        const mockLat = 37.7749 + (next / 1000);
        const mockLng = -122.4194 - (next / 1000);
        if (socket) {
          socket.emit('driverLocationUpdate', {
            bookingId: activeTrackBooking._id,
            lat: mockLat,
            lng: mockLng
          });
        }
        
        return next;
      });
    }, 1000);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      on_the_way: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-rose-100 text-rose-800 border-rose-200'
    };
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${badges[status] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 text-left tracking-tight mb-8">My Bookings</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Bookings Table List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden text-left">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Ride History</h3>
                <button onClick={fetchBookings} className="text-slate-400 hover:text-slate-700">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <Car className="mx-auto h-16 w-16 stroke-1 text-slate-300 mb-3" />
                  <p className="font-semibold text-slate-700">No bookings found</p>
                  <p className="text-sm">You haven't ordered any rides yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] table-auto border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs font-semibold uppercase text-slate-400 text-left">
                        <th className="pb-3">Cab Model / No</th>
                        <th className="pb-3">Trip Schedule</th>
                        <th className="pb-3">Route details</th>
                        <th className="pb-3">Fare</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((b) => (
                        <tr key={b._id} className="group hover:bg-slate-50/50 transition">
                          <td className="py-4">
                            <div className="font-bold text-slate-900">{b.carId?.model || 'Deleted Cab'}</div>
                            <div className="font-mono text-xs text-slate-400 uppercase mt-0.5">{b.carId?.carNumber || 'N/A'}</div>
                          </td>
                          <td className="py-4 text-slate-650">
                            <div>{new Date(b.pickupDate).toLocaleDateString()}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{b.pickupTime}</div>
                          </td>
                          <td className="py-4 text-slate-650">
                            <div className="truncate max-w-[150px]" title={b.pickupLocation}>{b.pickupLocation}</div>
                            <div className="text-xs text-slate-400 truncate max-w-[150px] mt-0.5" title={b.dropLocation}>
                              &darr; {b.dropLocation}
                            </div>
                          </td>
                          <td className="py-4 font-black text-slate-900">₹{b.totalFare.toFixed(2)}</td>
                          <td className="py-4">{getStatusBadge(b.status)}</td>
                          <td className="py-4 text-right space-x-2">
                            {(b.status === 'confirmed' || b.status === 'on_the_way') && (
                              <button
                                onClick={() => handleSelectTrack(b)}
                                className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 text-xs font-bold text-yellow-700 hover:bg-yellow-500 hover:text-slate-950 transition"
                              >
                                Track
                              </button>
                            )}
                            {(b.status === 'pending' || b.status === 'confirmed') && (
                              <button
                                onClick={() => handleCancelBooking(b._id)}
                                className="rounded-lg border border-red-200 text-red-500 hover:bg-red-50 px-2 py-1.5 transition inline-flex items-center justify-center"
                                title="Cancel Ride"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Tracking widget */}
          <div className="space-y-6">
            {activeTrackBooking ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-left space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="h-5 w-5 text-yellow-600 animate-pulse" /> Live Tracking
                  </h3>
                  <button onClick={() => setActiveTrackBooking(null)} className="text-xs text-slate-400 hover:underline">
                    Close
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Driver summary card */}
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-250 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 text-slate-950">
                      <Car className="h-5 w-5" />
                    </div>
                    <div className="text-sm">
                      <p className="font-extrabold text-slate-800">{activeTrackBooking.carId?.driverName || 'Driver'}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Assigned to vehicle: {activeTrackBooking.carId?.model}</p>
                    </div>
                  </div>

                  {/* Route points */}
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5 shrink-0"></div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase">Pickup Location</p>
                        <p className="font-semibold text-slate-800">{activeTrackBooking.pickupLocation}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase">Drop Destination</p>
                        <p className="font-semibold text-slate-800">{activeTrackBooking.dropLocation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Mock Map Component (SVG) */}
                  <div className="relative h-44 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
                    
                    {/* Simulated Path Line */}
                    <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M 50 120 Q 200 40, 350 120"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 50 120 Q 200 40, 350 120"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="4"
                        strokeDasharray="400"
                        strokeDashoffset={400 - (simulationProgress * 4)}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                    </svg>

                    {/* Start dot */}
                    <div className="absolute left-[50px] bottom-[50px] flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-yellow-500 ring-4 ring-yellow-500/20"></div>
                      <span className="text-[10px] text-slate-400 mt-1">Start</span>
                    </div>

                    {/* End dot */}
                    <div className="absolute right-[50px] bottom-[50px] flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-red-500 ring-4 ring-red-500/20"></div>
                      <span className="text-[10px] text-slate-400 mt-1">Dest</span>
                    </div>

                    {/* Moving Cab Icon */}
                    {isSimulating && (
                      <div
                        style={{
                          left: `${50 + (simulationProgress * 2.8)}px`,
                          bottom: `${50 + (Math.sin((simulationProgress / 100) * Math.PI) * 50)}px`
                        }}
                        className="absolute h-8 w-8 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center transition-all duration-500 shadow-md ring-4 ring-yellow-500/30"
                      >
                        <Navigation className="h-4 w-4 rotate-90 transform text-slate-950" />
                      </div>
                    )}

                    <div className="absolute bottom-2 right-2 text-[9px] text-slate-500 font-mono">
                      LAT: {driverLoc.lat.toFixed(5)} / LNG: {driverLoc.lng.toFixed(5)}
                    </div>

                    {!isSimulating && simulationProgress === 0 && (
                      <div className="absolute text-center bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 backdrop-blur-sm">
                        <p className="text-xs font-semibold">Cab tracking is ready</p>
                      </div>
                    )}
                  </div>

                  {/* Simulator Toggles */}
                  <div className="space-y-2">
                    {activeTrackBooking.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          if (socket) {
                            socket.emit('rideStatusChange', { bookingId: activeTrackBooking._id, status: 'on_the_way' });
                          }
                        }}
                        className="w-full rounded-xl bg-slate-900 text-white font-bold py-2.5 text-xs hover:bg-slate-800 transition"
                      >
                        Start Ride (Transition Status)
                      </button>
                    )}

                    {activeTrackBooking.status === 'on_the_way' && (
                      <button
                        onClick={startLocalSimulation}
                        disabled={isSimulating}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary text-white font-bold py-2.5 text-xs hover:bg-primary-dark disabled:opacity-50 transition shadow-md shadow-primary/20"
                      >
                        <Compass className="h-4 w-4" />
                        {isSimulating ? `Ride In Transit (${simulationProgress}%)` : 'Simulate Driver Transit'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 border-dashed bg-white p-8 text-center text-slate-405 flex flex-col items-center justify-center h-80">
                <Map className="mx-auto h-12 w-12 text-slate-300 stroke-1 mb-2" />
                <p className="text-sm font-semibold text-slate-600">Select an active ride</p>
                <p className="text-xs text-slate-400 mt-1">Click the "Track" button to inspect live route directions and simulator settings.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyBookings;

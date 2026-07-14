import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { bookingAPI, paymentAPI } from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { MapPin, Calendar, Clock, Car, Calculator, CreditCard, ChevronLeft } from 'lucide-react';

const BookCab = () => {
  const {
    selectedCar,
    pickupLocation: ctxPickup,
    dropLocation: ctxDrop,
    pickupDate: ctxPDate,
    dropDate: ctxDDate,
    pickupTime: ctxPTime,
    dropTime: ctxDTime,
    distance,
    totalFare,
    setRoute,
    setSchedule,
    calculateFareEstimate,
    clearBookingState
  } = useBooking();

  const navigate = useNavigate();

  // Local state for fields
  const [pickupCity, setPickupCity] = useState('');
  const [pickupState, setPickupState] = useState('');
  const [dropCity, setDropCity] = useState('');
  const [dropState, setDropState] = useState('');
  
  // Timings
  const [pickupDate, setPickupDate] = useState('');
  const [dropDate, setDropDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropTime, setDropTime] = useState('');

  const [loading, setLoading] = useState(false);
  const [fareCalculated, setFareCalculated] = useState(false);

  // Sync state if already in context
  useEffect(() => {
    if (!selectedCar) {
      toast.error('Please select a cab model first.');
      navigate('/cabs');
      return;
    }
  }, [selectedCar, navigate]);

  const handleCalculateFare = async (e) => {
    e.preventDefault();
    const pickupCombined = `${pickupCity.trim()}, ${pickupState.trim()}`;
    const dropCombined = `${dropCity.trim()}, ${dropState.trim()}`;

    if (!pickupCity || !pickupState || !dropCity || !dropState) {
      return toast.error('Please complete all pickup and drop address fields');
    }
    if (!pickupDate || !dropDate || !pickupTime || !dropTime) {
      return toast.error('Please schedule travel dates and times');
    }

    setLoading(true);
    // Save to context
    setRoute(pickupCombined, dropCombined);
    setSchedule(pickupDate, dropDate, pickupTime, dropTime);

    const estimate = await calculateFareEstimate(pickupCombined, dropCombined, selectedCar._id);
    setLoading(false);
    
    if (estimate) {
      setFareCalculated(true);
      toast.success('Fare calculated successfully!');
    }
  };

  const handleBookRide = async () => {
    if (!fareCalculated) {
      return toast.error('Please calculate fare first!');
    }

    setLoading(true);
    try {
      const bookingData = {
        carId: selectedCar._id,
        pickupLocation: `${pickupCity.trim()}, ${pickupState.trim()}`,
        dropLocation: `${dropCity.trim()}, ${dropState.trim()}`,
        pickupDate,
        dropDate,
        pickupTime,
        dropTime,
        totalFare
      };

      // 1. Book the ride (creates pending booking in MongoDB)
      const res = await bookingAPI.bookCab(bookingData);
      const bookingId = res.data._id;
      
      toast.success('Booking registered! Initiating checkout session...');

      // 2. Create Stripe mock payment checkout session
      const payRes = await paymentAPI.createSession(bookingId);
      
      // Clear the booking wizard states
      clearBookingState();
      
      // Redirect user to our mock Payment Simulation Gateway
      navigate(payRes.data.url);
    } catch (err) {
      console.error('Ride booking failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-left mb-6">
          <Link to="/cabs" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 transition">
            <ChevronLeft className="h-4 w-4" /> Change Cab
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Book Your Cab</h1>
          <p className="text-slate-500 text-sm">Fill in the routes and timing details to proceed.</p>
        </div>

        {selectedCar && (
          <div className="grid gap-8 md:grid-cols-3">
            {/* Form Details */}
            <div className="md:col-span-2 space-y-6">
              <form onSubmit={handleCalculateFare} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 text-left">
                
                {/* Pickup Location Row */}
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 mb-3">
                    <MapPin className="h-5 w-5 text-primary" /> Pickup Route
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-655">City</label>
                      <input
                        type="text"
                        required
                        value={pickupCity}
                        onChange={(e) => setPickupCity(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        placeholder="e.g. Noida"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-655">State / Region</label>
                      <input
                        type="text"
                        required
                        value={pickupState}
                        onChange={(e) => setPickupState(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        placeholder="e.g. UP"
                      />
                    </div>
                  </div>
                </div>

                {/* Drop Location Row */}
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 mb-3">
                    <MapPin className="h-5 w-5 text-accent" /> Drop Destination
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-655">City</label>
                      <input
                        type="text"
                        required
                        value={dropCity}
                        onChange={(e) => setDropCity(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        placeholder="e.g. Delhi"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-655">State / Region</label>
                      <input
                        type="text"
                        required
                        value={dropState}
                        onChange={(e) => setDropState(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        placeholder="e.g. DL"
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule details */}
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-800 mb-3">
                    <Calendar className="h-5 w-5 text-primary" /> Trip Schedule
                  </h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-655">Pickup Date</label>
                      <input
                        type="date"
                        required
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-655">Pickup Time</label>
                      <input
                        type="time"
                        required
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-655">Expected Drop Date</label>
                      <input
                        type="date"
                        required
                        value={dropDate}
                        onChange={(e) => setDropDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-655">Expected Drop Time</label>
                      <input
                        type="time"
                        required
                        value={dropTime}
                        onChange={(e) => setDropTime(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Compute button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center items-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50 transition"
                >
                  <Calculator className="h-4 w-4" /> Calculate Ride Fare
                </button>
              </form>
            </div>

            {/* Selected Cab Summary Panel */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-left">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                  Selected Vehicle
                </h3>
                
                <div className="space-y-4">
                  {selectedCar.carImage && (
                    <img
                      src={selectedCar.carImage.startsWith('/') ? `http://localhost:8000${selectedCar.carImage}` : selectedCar.carImage}
                      alt={selectedCar.model}
                      className="aspect-video w-full rounded-2xl object-cover object-center bg-slate-100 border"
                    />
                  )}
                  
                  <div>
                    <h4 className="font-extrabold text-lg text-slate-950">{selectedCar.model}</h4>
                    <p className="text-xs font-mono uppercase text-slate-400 mt-0.5">{selectedCar.carNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    <div>
                      <p className="text-xs text-slate-450">Type</p>
                      <p className="font-semibold text-slate-800">{selectedCar.carType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-450">Seats</p>
                      <p className="font-semibold text-slate-800">{selectedCar.seats} Persons</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-455">Rate/km</p>
                      <p className="font-semibold text-slate-800">₹{selectedCar.pricePerKm.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-455">Driver</p>
                      <p className="font-semibold text-slate-800 truncate">{selectedCar.driverName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estimate Billing Panel */}
              {fareCalculated && (
                <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 shadow-sm text-left animate-in fade-in zoom-in-95 duration-200">
                  <h3 className="text-base font-bold text-slate-900 border-b border-primary/20 pb-3 mb-4">
                    Fare Breakdown
                  </h3>
                  
                  <div className="space-y-3 text-sm text-slate-655">
                    <div className="flex justify-between">
                      <span>Calculated Distance</span>
                      <span className="font-bold text-slate-900">{distance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate/km</span>
                      <span className="font-bold text-slate-900">₹{selectedCar.pricePerKm.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-primary/20 pt-4 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-slate-455 leading-none">Total Fare</p>
                        <p className="text-2xl font-black text-slate-955 mt-1">₹{totalFare.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBookRide}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50 transition shadow-md shadow-primary/20 mt-6"
                  >
                    <CreditCard className="h-4 w-4" /> Book Ride & Pay
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookCab;

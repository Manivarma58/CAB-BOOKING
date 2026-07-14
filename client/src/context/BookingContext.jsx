import React, { createContext, useState, useContext } from 'react';
import { bookingAPI } from '../api';
import toast from 'react-hot-toast';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropDate, setDropDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropTime, setDropTime] = useState('');
  
  const [distance, setDistance] = useState(0);
  const [totalFare, setTotalFare] = useState(0);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectCar = (car) => {
    setSelectedCar(car);
  };

  const setRoute = (pickup, drop) => {
    setPickupLocation(pickup);
    setDropLocation(drop);
  };

  const setSchedule = (pDate, dDate, pTime, dTime) => {
    setPickupDate(pDate);
    setDropDate(dDate);
    setPickupTime(pTime);
    setDropTime(dTime);
  };

  const calculateFareEstimate = async (pLoc = pickupLocation, dLoc = dropLocation, cId = selectedCar?._id) => {
    if (!pLoc || !dLoc || !cId) {
      toast.error('Route coordinates and selected car details are incomplete');
      return null;
    }
    
    setLoading(true);
    try {
      const res = await bookingAPI.calculateFare({
        pickupLocation: pLoc,
        dropLocation: dLoc,
        carId: cId
      });
      setDistance(res.data.distance);
      setTotalFare(res.data.totalFare);
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error('Fare calculation error:', err);
      setLoading(false);
      return null;
    }
  };

  const clearBookingState = () => {
    setSelectedCar(null);
    setPickupLocation('');
    setDropLocation('');
    setPickupDate('');
    setDropDate('');
    setPickupTime('');
    setDropTime('');
    setDistance(0);
    setTotalFare(0);
    setCurrentBooking(null);
  };

  return (
    <BookingContext.Provider value={{
      selectedCar,
      pickupLocation,
      dropLocation,
      pickupDate,
      dropDate,
      pickupTime,
      dropTime,
      distance,
      totalFare,
      currentBooking,
      loading,
      selectCar,
      setRoute,
      setSchedule,
      calculateFareEstimate,
      setCurrentBooking,
      clearBookingState
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
export default BookingContext;

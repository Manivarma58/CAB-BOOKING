const Booking = require('../models/Booking');
const Car = require('../models/Car');

// Helper to determine mock distance in km between two strings deterministically
const getDistance = (pickup, drop) => {
  const cleanPickup = (pickup || '').trim().toLowerCase();
  const cleanDrop = (drop || '').trim().toLowerCase();
  
  if (!cleanPickup || !cleanDrop) return 10;
  
  // Deterministic calculation based on string character lengths and code sums
  let sum = 0;
  for (let i = 0; i < cleanPickup.length; i++) sum += cleanPickup.charCodeAt(i);
  for (let i = 0; i < cleanDrop.length; i++) sum += cleanDrop.charCodeAt(i);

  const distance = (sum % 36) + 5; // Yields a distance between 5km and 40km
  return distance;
};

// @desc    Calculate ride fare
// @route   POST /api/bookings/calculate-fare
// @access  Private
const calculateFare = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, carId } = req.body;

    if (!pickupLocation || !dropLocation || !carId) {
      return res.status(400).json({ message: 'Pickup, drop location and car ID are required' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const distance = getDistance(pickupLocation, dropLocation);
    const totalFare = Math.round(distance * car.pricePerKm);

    res.json({
      pickupLocation,
      dropLocation,
      carId,
      carModel: car.model,
      pricePerKm: car.pricePerKm,
      distance,
      totalFare
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const bookCab = async (req, res) => {
  try {
    const {
      carId,
      pickupLocation,
      dropLocation,
      pickupDate,
      dropDate,
      pickupTime,
      dropTime,
      totalFare
    } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (!car.availability) {
      return res.status(400).json({ message: 'This cab is already booked or currently unavailable' });
    }

    // Create the booking
    const booking = await Booking.create({
      userId: req.user._id,
      carId,
      pickupLocation,
      dropLocation,
      pickupDate,
      dropDate,
      pickupTime,
      dropTime,
      totalFare,
      status: 'pending', // Wait for payment or manual approval
      paymentStatus: 'pending'
    });

    // Toggle car availability to false when booked (or we can toggle on payment success)
    car.availability = false;
    await car.save();

    // Populate car and user info
    const populatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email phone')
      .populate('carId', 'model carNumber carType driverName pricePerKm');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's booking history
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('carId', 'model carType carNumber driverName carImage pricePerKm')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('carId', 'model carType carNumber driverName pricePerKm carImage');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify authorized user (either the user who booked or an admin)
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update the booking status
    booking.status = status;
    
    // If status completed or cancelled, make the car available again
    if (status === 'completed' || status === 'cancelled') {
      const car = await Car.findById(booking.carId);
      if (car) {
        car.availability = true;
        await car.save();
      }
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email phone')
      .populate('carId', 'model carType carNumber driverName pricePerKm');

    // Notify via Socket.io if integrated
    if (req.io) {
      req.io.emit('bookingStatusUpdate', updatedBooking);
    }

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ message: `Cannot cancel a ride that is already ${booking.status}` });
    }

    booking.status = 'cancelled';
    
    // Free the car
    const car = await Car.findById(booking.carId);
    if (car) {
      car.availability = true;
      await car.save();
    }

    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/admin
// @access  Private/Admin
const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'name email phone')
      .populate('carId', 'model carType carNumber driverName pricePerKm')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  calculateFare,
  bookCab,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAdminBookings
};

const express = require('express');
const router = express.Router();
const {
  bookCab,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAdminBookings,
  calculateFare
} = require('../controllers/bookingController');
const { protect, adminProtect } = require('../middlewares/auth');

// Protected booking actions for authenticated users
router.post('/', protect, bookCab);
router.get('/', protect, getBookings);
router.post('/calculate-fare', protect, calculateFare);

// Admin-only global bookings review
router.get('/admin', protect, adminProtect, getAdminBookings);

// Specific booking endpoints
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;

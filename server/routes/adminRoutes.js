const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getDashboardStats,
  manageUsers,
  viewAllBookings
} = require('../controllers/adminController');
const { getAllCars } = require('../controllers/carController');
const { protect, adminProtect } = require('../middlewares/auth');
const upload = require('../middlewares/multer');

// Public auth routes
router.post('/register', upload.single('profileImage'), registerAdmin);
router.post('/login', loginAdmin);

// Protected admin routes
router.get('/dashboard', protect, adminProtect, getDashboardStats);
router.get('/users', protect, adminProtect, manageUsers);
router.get('/bookings', protect, adminProtect, viewAllBookings);
router.get('/cars', protect, adminProtect, getAllCars);

module.exports = router;

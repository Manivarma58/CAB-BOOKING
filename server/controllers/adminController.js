const Admin = require('../models/Admin');
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

// Token generation helper
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const profileImage = req.file ? `/uploads/${req.file.filename}` : '';
    const admin = await Admin.create({
      name,
      email,
      password,
      profileImage,
      role: 'admin'
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage,
        token: generateToken(admin._id, admin.role)
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (admin && (await admin.comparePassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage,
        token: generateToken(admin._id, admin.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalBookings = await Booking.countDocuments();
    const availableCabs = await Car.countDocuments({ availability: true });
    const totalCabs = await Car.countDocuments();

    // Calculate revenue (sum of all fares from confirmed/completed or paid bookings)
    const revenueResult = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalFare' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Monthly revenue and booking count analysis for charts
    const monthlyStats = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          bookingsCount: { $sum: 1 },
          revenue: { $sum: '$totalFare' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Popular cab types
    const cabTypeStats = await Booking.aggregate([
      {
        $lookup: {
          from: 'cars',
          localField: 'carId',
          foreignField: '_id',
          as: 'carDetails'
        }
      },
      { $unwind: '$carDetails' },
      {
        $group: {
          _id: '$carDetails.carType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent Bookings activity
    const recentActivities = await Booking.find()
      .populate('userId', 'name email')
      .populate('carId', 'model carNumber pricePerKm')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      stats: {
        totalUsers,
        totalDrivers,
        totalBookings,
        availableCabs,
        totalCabs,
        totalRevenue
      },
      monthlyStats,
      cabTypeStats,
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin manage users
// @route   GET /api/admin/users
// @access  Private/Admin
const manageUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin view all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const viewAllBookings = async (req, res) => {
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
  registerAdmin,
  loginAdmin,
  getDashboardStats,
  manageUsers,
  viewAllBookings
};

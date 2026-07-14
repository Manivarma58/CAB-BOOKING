const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// @desc    Unified Login for Users, Drivers, and Admins
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (role === 'admin') {
      const admin = await Admin.findOne({ email });
      if (admin && (await admin.comparePassword(password))) {
        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
          expiresIn: '30d'
        });
        return res.json({
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: 'admin',
          profileImage: admin.profileImage,
          token
        });
      }
    } else {
      const user = await User.findOne({ email });
      if (user && (await user.comparePassword(password))) {
        // If a specific role (e.g. driver/user) is requested, check compatibility
        if (role && user.role !== role) {
          return res.status(401).json({ message: `Access denied. Account is not registered as ${role}.` });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
          expiresIn: '30d'
        });
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          profileImage: user.profileImage,
          token
        });
      }
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login };

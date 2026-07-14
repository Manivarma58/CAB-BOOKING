const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try to find user in User collection or Admin collection
      let userObj = await User.findById(decoded.id).select('-password');
      
      if (!userObj) {
        userObj = await Admin.findById(decoded.id).select('-password');
      }

      if (!userObj) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Attach user to req
      req.user = userObj;
      next();
    } catch (error) {
      console.error('Auth protect error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const adminProtect = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};

module.exports = { protect, adminProtect };

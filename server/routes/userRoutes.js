const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUserById
} = require('../controllers/userController');
const { protect, adminProtect } = require('../middlewares/auth');
const upload = require('../middlewares/multer');

// Public auth routes
router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login', loginUser);

// Protected user profile routes
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, upload.single('profileImage'), updateProfile);

// Admin-only user management routes
router.route('/')
  .get(protect, adminProtect, getAllUsers);

router.route('/:id')
  .get(protect, adminProtect, getUserById)
  .put(protect, adminProtect, upload.single('profileImage'), updateUserById)
  .delete(protect, adminProtect, deleteUser);

module.exports = router;

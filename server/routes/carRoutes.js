const express = require('express');
const router = express.Router();
const {
  addCar,
  getAllCars,
  getAvailableCars,
  searchCars,
  getCarById,
  updateCar,
  deleteCar
} = require('../controllers/carController');
const { protect, adminProtect } = require('../middlewares/auth');
const upload = require('../middlewares/multer');

// Public listing/filtering routes
router.get('/', getAllCars);
router.get('/available', getAvailableCars);
router.get('/search', searchCars);
router.get('/:id', getCarById);

// Admin-only write/delete routes
router.post('/', protect, adminProtect, upload.single('carImage'), addCar);
router.put('/:id', protect, adminProtect, upload.single('carImage'), updateCar);
router.delete('/:id', protect, adminProtect, deleteCar);

module.exports = router;

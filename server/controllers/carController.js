const Car = require('../models/Car');

// @desc    Add a new car
// @route   POST /api/cars
// @access  Private/Admin
const addCar = async (req, res) => {
  try {
    const { model, carType, carNumber, driverName, pricePerKm, seats, availability } = req.body;

    // Check if car number is unique
    const carExists = await Car.findOne({ carNumber: carNumber.toUpperCase() });
    if (carExists) {
      return res.status(400).json({ message: 'Car with this registration number already exists' });
    }

    const carImage = req.file ? `/uploads/${req.file.filename}` : '';

    const car = await Car.create({
      model,
      carType,
      carNumber: carNumber.toUpperCase(),
      driverName,
      pricePerKm: Number(pricePerKm),
      seats: Number(seats),
      carImage,
      availability: availability === 'false' ? false : true
    });

    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all cars with filters
// @route   GET /api/cars
// @access  Public
const getAllCars = async (req, res) => {
  try {
    const { carType, availability, seats, sortByPrice } = req.query;
    const filterQuery = {};

    if (carType) {
      filterQuery.carType = carType;
    }
    if (availability) {
      filterQuery.availability = availability === 'true';
    }
    if (seats) {
      filterQuery.seats = Number(seats);
    }

    let query = Car.find(filterQuery);

    if (sortByPrice) {
      const order = sortByPrice === 'desc' ? -1 : 1;
      query = query.sort({ pricePerKm: order });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const cars = await query;
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get car by ID
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update car details
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      car.model = req.body.model || car.model;
      car.carType = req.body.carType || car.carType;
      car.carNumber = req.body.carNumber ? req.body.carNumber.toUpperCase() : car.carNumber;
      car.driverName = req.body.driverName || car.driverName;
      car.pricePerKm = req.body.pricePerKm !== undefined ? Number(req.body.pricePerKm) : car.pricePerKm;
      car.seats = req.body.seats !== undefined ? Number(req.body.seats) : car.seats;
      
      if (req.body.availability !== undefined) {
        car.availability = req.body.availability === 'true' || req.body.availability === true;
      }

      if (req.file) {
        car.carImage = `/uploads/${req.file.filename}`;
      }

      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      await Car.deleteOne({ _id: req.params.id });
      res.json({ message: 'Car removed successfully' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get only available cars
// @route   GET /api/cars/available
// @access  Public
const getAvailableCars = async (req, res) => {
  try {
    const cars = await Car.find({ availability: true }).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search cars by model name or car type
// @route   GET /api/cars/search
// @access  Public
const searchCars = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const cars = await Car.find({
      $or: [
        { model: { $regex: q, $options: 'i' } },
        { carType: { $regex: q, $options: 'i' } },
        { driverName: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
  getAvailableCars,
  searchCars
};

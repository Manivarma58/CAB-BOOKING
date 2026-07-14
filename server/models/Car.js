const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: [true, 'Please provide car model name']
    },
    carType: {
      type: String,
      required: [true, 'Please provide car type'],
      enum: {
        values: ['Hatchback', 'Sedan', 'SUV', 'Mini', 'Bike'],
        message: '{VALUE} is not a valid car type'
      }
    },
    carNumber: {
      type: String,
      required: [true, 'Please provide car number plate'],
      unique: true,
      trim: true,
      uppercase: true
    },
    driverName: {
      type: String,
      required: [true, 'Please provide driver name']
    },
    pricePerKm: {
      type: Number,
      required: [true, 'Please provide price per kilometer']
    },
    carImage: {
      type: String,
      default: ''
    },
    availability: {
      type: Boolean,
      default: true
    },
    seats: {
      type: Number,
      required: [true, 'Please provide number of seats']
    }
  },
  {
    timestamps: true
  }
);

const Car = mongoose.model('Car', carSchema);
module.exports = Car;

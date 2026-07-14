const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Car ID is required']
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required']
    },
    dropLocation: {
      type: String,
      required: [true, 'Drop location is required']
    },
    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required']
    },
    dropDate: {
      type: Date,
      required: [true, 'Drop date is required']
    },
    pickupTime: {
      type: String,
      required: [true, 'Pickup time is required']
    },
    dropTime: {
      type: String,
      required: [true, 'Drop time is required']
    },
    totalFare: {
      type: Number,
      required: [true, 'Total fare is required']
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'on_the_way', 'completed', 'cancelled'],
      default: 'pending'
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    paymentId: {
      type: String,
      default: ''
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;

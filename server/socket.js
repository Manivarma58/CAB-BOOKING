const socketIO = require('socket.io');
const Booking = require('./models/Booking');

const initSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: '*', // Allows all origins for development testing
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join room for specific booking tracking
    socket.on('joinBooking', ({ bookingId }) => {
      socket.join(bookingId);
      console.log(`Client ${socket.id} joined room for booking: ${bookingId}`);
    });

    // Driver updates live location coordinates
    socket.on('driverLocationUpdate', ({ bookingId, lat, lng }) => {
      // Broadcast location coordinates to all users in that booking room
      io.to(bookingId).emit('locationUpdate', { lat, lng });
      console.log(`Location update for room ${bookingId}: lat=${lat}, lng=${lng}`);
    });

    // Ride status tracking
    socket.on('rideStatusChange', async ({ bookingId, status }) => {
      try {
        const booking = await Booking.findById(bookingId);
        if (booking) {
          booking.status = status;
          
          if (status === 'completed' || status === 'cancelled') {
            const Car = require('./models/Car');
            const car = await Car.findById(booking.carId);
            if (car) {
              car.availability = true;
              await car.save();
            }
          }
          
          await booking.save();
          
          // Notify room members
          io.to(bookingId).emit('bookingUpdated', booking);
          // Notify global listener (e.g., admin dashboard)
          io.emit('globalBookingUpdate', booking);
        }
      } catch (err) {
        console.error(`Socket status update error: ${err.message}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;

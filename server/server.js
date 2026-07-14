require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const connectDB = require('./db/config');
const initSocket = require('./socket');
const errorHandler = require('./middlewares/errorHandler');

// Route Imports
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Initialize WebSockets
const io = initSocket(server);

// Middleware
app.use(cors({
  origin: '*', // Customize for production domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve upload files statically
app.use('/uploads', express.static(uploadsDir));

// Attach Socket.io to the request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Register API Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Base API route status
app.get('/api/status', (req, res) => {
  res.json({ message: 'UCab Server API is running smoothly' });
});

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('UCab Backend Server is running in development mode.');
  });
}

// Global Error Handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

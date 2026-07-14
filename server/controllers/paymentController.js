const Booking = require('../models/Booking');

// @desc    Initiate payment for booking (Stripe mock session or order generation)
// @route   POST /api/payments/create-session
// @access  Private
const createPaymentSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('carId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Return a mock checkout session order
    // In a real application, you would initialize Stripe/Razorpay and create a transaction session:
    // const session = await stripe.checkout.sessions.create({ ... })
    
    const mockSessionId = 'cs_test_' + Math.random().toString(36).substring(2, 15);
    const mockPaymentUrl = `/payment-gateway-sim?bookingId=${bookingId}&sessionId=${mockSessionId}&amount=${booking.totalFare}`;

    res.json({
      sessionId: mockSessionId,
      url: mockPaymentUrl,
      bookingId: booking._id,
      amount: booking.totalFare,
      currency: 'USD'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify payment success callback
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { bookingId, sessionId, paymentId, status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({ message: 'Booking ID and status are required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (status === 'success') {
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      booking.paymentId = paymentId || `pay_mock_${Math.random().toString(36).substring(2, 10)}`;
      await booking.save();

      // Emit real-time status update to clients if socket is active
      if (req.io) {
        req.io.emit('bookingStatusUpdate', booking);
      }

      return res.json({
        success: true,
        message: 'Payment confirmed and booking verified',
        booking
      });
    } else {
      booking.paymentStatus = 'failed';
      booking.status = 'cancelled';
      await booking.save();

      return res.json({
        success: false,
        message: 'Payment marked as failed',
        booking
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentSession,
  verifyPayment
};

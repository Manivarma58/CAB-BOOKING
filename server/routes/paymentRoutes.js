const express = require('express');
const router = express.Router();
const { createPaymentSession, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/auth');

router.post('/create-session', protect, createPaymentSession);
router.post('/verify', protect, verifyPayment);

module.exports = router;

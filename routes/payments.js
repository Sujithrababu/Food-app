const express = require('express');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/payments/process
// @desc    Process payment for an order
// @access  Private
router.post('/process', auth, async (req, res) => {
  try {
    const { orderId, paymentMethod, paymentDetails } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create payment record
    const payment = new Payment({
      order: orderId,
      user: req.user._id,
      amount: order.total,
      paymentMethod,
      paymentDetails,
      status: 'processing'
    });

    // Simulate payment processing
    setTimeout(() => {
      payment.status = 'completed';
      payment.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      payment.save();
    }, 2000);

    await payment.save();

    // Update order payment status
    order.paymentStatus = 'paid';
    await order.save();

    res.json({ message: 'Payment processed successfully', payment });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payments/order/:orderId
// @desc    Get payment details for an order
// @access  Private
router.get('/order/:orderId', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ order: req.params.orderId })
      .populate('order', 'total status');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

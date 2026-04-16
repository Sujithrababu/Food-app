const express = require('express');
const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/delivery/available
// @desc    Get available delivery assignments
// @access  Private (Delivery persons only)
router.get('/available', auth, authorize('delivery_person'), async (req, res) => {
  try {
    const deliveries = await Delivery.find({ 
      status: 'assigned',
      deliveryPerson: null 
    }).populate('order', 'total deliveryAddress');

    res.json(deliveries);
  } catch (error) {
    console.error('Get available deliveries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/delivery/:id/accept
// @desc    Accept delivery assignment
// @access  Private (Delivery persons only)
router.post('/:id/accept', auth, authorize('delivery_person'), async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if (delivery.status !== 'assigned' || delivery.deliveryPerson) {
      return res.status(400).json({ message: 'Delivery not available' });
    }

    delivery.deliveryPerson = req.user._id;
    delivery.status = 'assigned';
    await delivery.save();

    res.json(delivery);
  } catch (error) {
    console.error('Accept delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/delivery/:id/status
// @desc    Update delivery status
// @access  Private (Delivery persons only)
router.put('/:id/status', auth, authorize('delivery_person'), async (req, res) => {
  try {
    const { status } = req.body;
    const delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if (delivery.deliveryPerson.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    delivery.status = status;
    
    // Update timestamps based on status
    if (status === 'picked_up') {
      delivery.actualPickupTime = new Date();
    } else if (status === 'delivered') {
      delivery.actualDeliveryTime = new Date();
    }

    await delivery.save();

    res.json(delivery);
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order from cart
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { deliveryAddress, orderType, paymentMethod, orderNotes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.menuItem');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Create order from cart items
    const orderData = {
      user: req.user._id,
      restaurant: cart.restaurant,
      items: cart.items.map(item => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization,
        specialInstructions: item.specialInstructions
      })),
      deliveryAddress: deliveryAddress || cart.deliveryAddress,
      orderType: orderType || 'delivery',
      paymentMethod,
      orderNotes,
      subtotal: cart.subtotal,
      tax: cart.tax,
      deliveryFee: cart.deliveryFee,
      discount: cart.discount,
      total: cart.total
    };

    const order = new Order(orderData);
    await order.save();

    // Clear cart after successful order
    cart.items = [];
    cart.restaurant = null;
    cart.subtotal = 0;
    cart.tax = 0;
    cart.deliveryFee = 0;
    cart.discount = 0;
    cart.total = 0;
    await cart.save();

    // Populate order details
    await order.populate([
      { path: 'restaurant', select: 'name address phone' },
      { path: 'items.menuItem', select: 'name price images' }
    ]);

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('restaurant', 'name address')
      .populate('items.menuItem', 'name price images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name address phone')
      .populate('items.menuItem', 'name price images description')
      .populate('deliveryPerson', 'name phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Restaurant owners, delivery persons, admins)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization based on user role
    let isAuthorized = false;
    
    if (req.user.role === 'admin') {
      isAuthorized = true;
    } else if (req.user.role === 'restaurant_owner') {
      const restaurant = await Restaurant.findById(order.restaurant);
      isAuthorized = restaurant && restaurant.owner.toString() === req.user._id.toString();
    } else if (req.user.role === 'delivery_person') {
      isAuthorized = order.deliveryPerson && order.deliveryPerson.toString() === req.user._id.toString();
    }

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    
    // Update timestamps based on status
    if (status === 'confirmed') {
      order.estimatedDeliveryTime = new Date(Date.now() + 45 * 60000); // 45 minutes
    } else if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private (Order owner or restaurant owner)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    // Check authorization
    let isAuthorized = false;
    
    if (req.user.role === 'admin') {
      isAuthorized = true;
    } else if (order.user.toString() === req.user._id.toString()) {
      isAuthorized = true;
    } else if (req.user.role === 'restaurant_owner') {
      const restaurant = await Restaurant.findById(order.restaurant);
      isAuthorized = restaurant && restaurant.owner.toString() === req.user._id.toString();
    }

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = 'cancelled';
    order.cancellationReason = cancellationReason;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/restaurant/:restaurantId
// @desc    Get orders for a specific restaurant
// @access  Private (Restaurant owners only)
router.get('/restaurant/:restaurantId', auth, authorize('restaurant_owner', 'admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { restaurant: req.params.restaurantId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name phone address')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get restaurant orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

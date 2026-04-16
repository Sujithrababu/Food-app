const express = require('express');
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.menuItem',
        populate: { path: 'restaurant', select: 'name address' }
      });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', auth, async (req, res) => {
  try {
    const { menuItemId, quantity, customization, specialInstructions } = req.body;

    // Validate menu item
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem || !menuItem.isAvailable) {
      return res.status(400).json({ message: 'Menu item not available' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: req.user._id,
        restaurant: menuItem.restaurant,
        items: []
      });
    } else if (cart.restaurant && cart.restaurant.toString() !== menuItem.restaurant.toString()) {
      // Check if adding item from different restaurant
      return res.status(400).json({ 
        message: 'Cannot add items from different restaurants. Please clear your cart first.' 
      });
    }
    
    // Ensure restaurant field is set on cart
    if (!cart.restaurant) {
      cart.restaurant = menuItem.restaurant;
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.menuItem.toString() === menuItemId
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        menuItem: menuItemId,
        quantity,
        price: menuItem.price,
        customization: customization || [],
        specialInstructions
      });
    }

    // Update cart totals
    await updateCartTotals(cart);
    await cart.save();

    // Populate menu item details
    await cart.populate({
      path: 'items.menuItem',
      populate: { path: 'restaurant', select: 'name address' }
    });

    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cart/update/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await updateCartTotals(cart);
    await cart.save();

    await cart.populate({
      path: 'items.menuItem',
      populate: { path: 'restaurant', select: 'name address' }
    });

    res.json(cart);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== itemId
    );

    if (cart.items.length === 0) {
      cart.restaurant = null;
    }

    await updateCartTotals(cart);
    await cart.save();

    await cart.populate({
      path: 'items.menuItem',
      populate: { path: 'restaurant', select: 'name address' }
    });

    res.json(cart);
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.restaurant = null;
    cart.subtotal = 0;
    cart.tax = 0;
    cart.deliveryFee = 0;
    cart.discount = 0;
    cart.total = 0;

    await cart.save();
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cart/apply-coupon
// @desc    Apply coupon to cart
// @access  Private
router.post('/apply-coupon', auth, async (req, res) => {
  try {
    const { couponCode } = req.body;

    // This is a simplified coupon system
    // In a real app, you'd validate against a coupon database
    if (couponCode === 'WELCOME10') {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      cart.appliedCoupon = {
        code: couponCode,
        discount: cart.subtotal * 0.1 // 10% discount
      };

      await updateCartTotals(cart);
      await cart.save();

      res.json(cart);
    } else {
      res.status(400).json({ message: 'Invalid coupon code' });
    }
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to update cart totals
async function updateCartTotals(cart) {
  cart.subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Calculate tax (simplified - 8.5%)
  cart.tax = cart.subtotal * 0.085;

  // Get delivery fee from restaurant
  if (cart.restaurant) {
    const restaurant = await Restaurant.findById(cart.restaurant);
    if (restaurant && restaurant.deliveryInfo && restaurant.deliveryInfo.deliveryFee) {
      cart.deliveryFee = restaurant.deliveryInfo.deliveryFee;
    } else {
      cart.deliveryFee = 0;
    }
  } else {
    cart.deliveryFee = 0;
  }

  // Apply discount
  const discount = cart.appliedCoupon ? cart.appliedCoupon.discount : 0;
  cart.discount = discount;

  // Calculate total with proper fallbacks
  cart.total = (cart.subtotal || 0) + (cart.tax || 0) + (cart.deliveryFee || 0) - (cart.discount || 0);
}

module.exports = router;

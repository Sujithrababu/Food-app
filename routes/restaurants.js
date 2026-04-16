const express = require('express');
const Restaurant = require('../models/Restaurant');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/restaurants
// @desc    Get all restaurants with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      cuisine, 
      rating, 
      delivery, 
      pickup, 
      search,
      lat,
      lng,
      radius = 10
    } = req.query;

    let query = { isActive: true };

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = { $in: cuisine.split(',') };
    }

    // Filter by rating
    if (rating) {
      query['rating.average'] = { $gte: parseFloat(rating) };
    }

    // Filter by features
    if (delivery === 'true') {
      query.features = { $in: ['delivery'] };
    }

    if (pickup === 'true') {
      query.features = { $in: ['pickup'] };
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Location-based search
    if (lat && lng) {
      query['address.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const restaurants = await Restaurant.find(query)
      .populate('owner', 'name email')
      .sort({ 'rating.average': -1, 'rating.count': -1 });

    res.json(restaurants);
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/restaurants/:id
// @desc    Get restaurant by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' }
      });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/restaurants
// @desc    Create a new restaurant
// @access  Private (Restaurant owners only)
router.post('/', auth, authorize('restaurant_owner', 'admin'), async (req, res) => {
  try {
    const restaurantData = {
      ...req.body,
      owner: req.user._id
    };

    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();

    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/restaurants/:id
// @desc    Update restaurant
// @access  Private (Owner or admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user is owner or admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/restaurants/:id
// @desc    Delete restaurant
// @access  Private (Owner or admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user is owner or admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/restaurants/owner/my-restaurants
// @desc    Get restaurants owned by current user
// @access  Private (Restaurant owners only)
router.get('/owner/my-restaurants', auth, authorize('restaurant_owner', 'admin'), async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id });
    res.json(restaurants);
  } catch (error) {
    console.error('Get owner restaurants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

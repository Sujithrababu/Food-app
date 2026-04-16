const express = require('express');
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { restaurantId, menuItemId, orderId, rating, title, comment, images } = req.body;

    // Check if user has already reviewed this restaurant/item
    const existingReview = await Review.findOne({
      user: req.user._id,
      restaurant: restaurantId,
      menuItem: menuItemId || null
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }

    const review = new Review({
      user: req.user._id,
      restaurant: restaurantId,
      menuItem: menuItemId,
      order: orderId,
      rating,
      title,
      comment,
      images
    });

    await review.save();

    // Update restaurant rating
    await updateRestaurantRating(restaurantId);

    // Update menu item rating if applicable
    if (menuItemId) {
      await updateMenuItemRating(menuItemId);
    }

    await review.populate('user', 'name');
    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/restaurant/:restaurantId
// @desc    Get reviews for a restaurant
// @access  Public
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    
    let query = { 
      restaurant: req.params.restaurantId,
      isHidden: false 
    };

    if (rating) {
      query.rating = parseInt(rating);
    }

    const reviews = await Review.find(query)
      .populate('user', 'name')
      .populate('menuItem', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get restaurant reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private (Review owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Update restaurant rating
    await updateRestaurantRating(review.restaurant);

    // Update menu item rating if applicable
    if (review.menuItem) {
      await updateMenuItemRating(review.menuItem);
    }

    res.json(updatedReview);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private (Review owner or admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update restaurant rating
    await updateRestaurantRating(review.restaurant);

    // Update menu item rating if applicable
    if (review.menuItem) {
      await updateMenuItemRating(review.menuItem);
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to update restaurant rating
async function updateRestaurantRating(restaurantId) {
  const reviews = await Review.find({ 
    restaurant: restaurantId,
    isHidden: false 
  });

  if (reviews.length > 0) {
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await Restaurant.findByIdAndUpdate(restaurantId, {
      'rating.average': Math.round(averageRating * 10) / 10,
      'rating.count': reviews.length
    });
  }
}

// Helper function to update menu item rating
async function updateMenuItemRating(menuItemId) {
  const reviews = await Review.find({ 
    menuItem: menuItemId,
    isHidden: false 
  });

  if (reviews.length > 0) {
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await MenuItem.findByIdAndUpdate(menuItemId, {
      'rating.average': Math.round(averageRating * 10) / 10,
      'rating.count': reviews.length
    });
  }
}

module.exports = router;

const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB Connected');
  
  // Get the first restaurant
  const restaurant = await Restaurant.findOne();
  if (restaurant) {
    console.log('First restaurant ID:', restaurant._id);
    console.log('Restaurant name:', restaurant.name);
  } else {
    console.log('No restaurants found');
  }
  
  process.exit(0);
})
.catch(err => {
  console.log('MongoDB Connection Error:', err);
  process.exit(1);
});

const mongoose = require('mongoose');
const { restaurants, menuItems } = require('./seedData');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected for seeding'))
.catch(err => console.log('MongoDB Connection Error:', err));

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user if not exists
    const adminUser = await User.findOne({ email: 'admin@foodapp.com' });
    if (!adminUser) {
      console.log('Creating admin user...');
      const newAdmin = new User({
        name: 'Admin User',
        email: 'admin@foodapp.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1-555-0000',
        address: {
          street: 'Admin Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10000'
        },
        isVerified: true
      });
      await newAdmin.save();
      console.log('Admin user created');
    }

    // Insert restaurants with admin as owner
    console.log('Inserting restaurants...');
    const restaurantsWithOwner = restaurants.map(restaurant => ({
      ...restaurant,
      owner: adminUser._id
    }));
    const insertedRestaurants = await Restaurant.insertMany(restaurantsWithOwner);
    console.log(`Inserted ${insertedRestaurants.length} restaurants`);

    // Assign menu items to restaurants
    const restaurantMenuItems = [];
    const restaurantIds = insertedRestaurants.map(r => r._id);
    
    // Pizza Palace items (first restaurant)
    restaurantMenuItems.push(
      ...menuItems.slice(0, 3).map(item => ({
        ...item,
        restaurant: restaurantIds[0]
      }))
    );

    // Burger Barn items (second restaurant)
    restaurantMenuItems.push(
      ...menuItems.slice(3, 6).map(item => ({
        ...item,
        restaurant: restaurantIds[1]
      }))
    );

    // Sushi Sensation items (third restaurant)
    restaurantMenuItems.push(
      ...menuItems.slice(6, 9).map(item => ({
        ...item,
        restaurant: restaurantIds[2]
      }))
    );

    // Taco Time items (fourth restaurant)
    restaurantMenuItems.push(
      ...menuItems.slice(9, 11).map(item => ({
        ...item,
        restaurant: restaurantIds[3]
      }))
    );

    // Insert menu items
    console.log('Inserting menu items...');
    const insertedMenuItems = await MenuItem.insertMany(restaurantMenuItems);
    console.log(`Inserted ${insertedMenuItems.length} menu items`);

    console.log('Database seeding completed successfully!');
    console.log('\nSample Data Summary:');
    console.log('- 5 Restaurants with real data');
    console.log('- 11 Menu items across different restaurants');
    console.log('- Admin user created (admin@foodapp.com / admin123)');
    console.log('\nYou can now start using the application with real data!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();

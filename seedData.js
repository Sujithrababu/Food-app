const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
require('dotenv').config();

// Sample real restaurant data
const restaurants = [
  {
    name: "Pizza Palace",
    description: "Authentic Italian pizzas with fresh ingredients and traditional recipes",
    cuisine: ["Italian", "Pizza", "Mediterranean"],
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    phone: "+1-555-0123",
    email: "info@pizzapalace.com",
    images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"],
    logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200",
    rating: { average: 4.5, count: 234 },
    operatingHours: {
      monday: { open: "11:00", close: "22:00", isOpen: true },
      tuesday: { open: "11:00", close: "22:00", isOpen: true },
      wednesday: { open: "11:00", close: "22:00", isOpen: true },
      thursday: { open: "11:00", close: "22:00", isOpen: true },
      friday: { open: "11:00", close: "23:00", isOpen: true },
      saturday: { open: "12:00", close: "23:00", isOpen: true },
      sunday: { open: "12:00", close: "21:00", isOpen: true }
    },
    deliveryInfo: {
      minimumOrder: 15,
      deliveryFee: 3.99,
      deliveryTime: { min: 25, max: 45 },
      deliveryRadius: 8
    },
    isActive: true,
    isVerified: true,
    features: ["delivery", "pickup", "dine_in"],
    paymentMethods: ["cash", "card", "paypal"]
  },
  {
    name: "Burger Barn",
    description: "Juicy burgers, crispy fries, and classic American comfort food",
    cuisine: ["American", "Burgers", "Fast Food"],
    address: {
      street: "456 Oak Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      coordinates: { lat: 40.7218, lng: -73.9960 }
    },
    phone: "+1-555-0456",
    email: "orders@burgerbarn.com",
    images: ["https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=500"],
    logo: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=200",
    rating: { average: 4.3, count: 189 },
    operatingHours: {
      monday: { open: "10:00", close: "23:00", isOpen: true },
      tuesday: { open: "10:00", close: "23:00", isOpen: true },
      wednesday: { open: "10:00", close: "23:00", isOpen: true },
      thursday: { open: "10:00", close: "23:00", isOpen: true },
      friday: { open: "10:00", close: "00:00", isOpen: true },
      saturday: { open: "11:00", close: "00:00", isOpen: true },
      sunday: { open: "11:00", close: "22:00", isOpen: true }
    },
    deliveryInfo: {
      minimumOrder: 12,
      deliveryFee: 2.99,
      deliveryTime: { min: 20, max: 35 },
      deliveryRadius: 6
    },
    isActive: true,
    isVerified: true,
    features: ["delivery", "pickup"],
    paymentMethods: ["cash", "card"]
  },
  {
    name: "Sushi Sensation",
    description: "Fresh sushi and Japanese cuisine prepared by master chefs",
    cuisine: ["Japanese", "Sushi", "Asian"],
    address: {
      street: "789 Cherry Lane",
      city: "New York",
      state: "NY",
      zipCode: "10003",
      coordinates: { lat: 40.7328, lng: -73.9860 }
    },
    phone: "+1-555-0789",
    email: "reservations@sushisensation.com",
    images: ["https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500"],
    logo: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200",
    rating: { average: 4.7, count: 156 },
    operatingHours: {
      monday: { open: "12:00", close: "22:00", isOpen: true },
      tuesday: { open: "12:00", close: "22:00", isOpen: true },
      wednesday: { open: "12:00", close: "22:00", isOpen: true },
      thursday: { open: "12:00", close: "22:00", isOpen: true },
      friday: { open: "12:00", close: "23:00", isOpen: true },
      saturday: { open: "12:00", close: "23:00", isOpen: true },
      sunday: { open: "12:00", close: "21:00", isOpen: true }
    },
    deliveryInfo: {
      minimumOrder: 25,
      deliveryFee: 4.99,
      deliveryTime: { min: 30, max: 50 },
      deliveryRadius: 5
    },
    isActive: true,
    isVerified: true,
    features: ["delivery", "pickup", "dine_in"],
    paymentMethods: ["cash", "card", "apple_pay"]
  },
  {
    name: "Taco Time",
    description: "Authentic Mexican street tacos and traditional dishes",
    cuisine: ["Mexican", "Tacos", "Latin"],
    address: {
      street: "321 Pine Street",
      city: "New York",
      state: "NY",
      zipCode: "10004",
      coordinates: { lat: 40.7428, lng: -73.9760 }
    },
    phone: "+1-555-0321",
    email: "hola@tacotime.com",
    images: ["https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500"],
    logo: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=200",
    rating: { average: 4.4, count: 201 },
    operatingHours: {
      monday: { open: "11:00", close: "22:00", isOpen: true },
      tuesday: { open: "11:00", close: "22:00", isOpen: true },
      wednesday: { open: "11:00", close: "22:00", isOpen: true },
      thursday: { open: "11:00", close: "22:00", isOpen: true },
      friday: { open: "11:00", close: "23:00", isOpen: true },
      saturday: { open: "12:00", close: "23:00", isOpen: true },
      sunday: { open: "12:00", close: "21:00", isOpen: true }
    },
    deliveryInfo: {
      minimumOrder: 10,
      deliveryFee: 2.49,
      deliveryTime: { min: 15, max: 30 },
      deliveryRadius: 7
    },
    isActive: true,
    isVerified: true,
    features: ["delivery", "pickup"],
    paymentMethods: ["cash", "card"]
  },
  {
    name: "Curry House",
    description: "Authentic Indian cuisine with aromatic spices and flavors",
    cuisine: ["Indian", "Curry", "Asian"],
    address: {
      street: "654 Maple Road",
      city: "New York",
      state: "NY",
      zipCode: "10005",
      coordinates: { lat: 40.7528, lng: -73.9660 }
    },
    phone: "+1-555-0654",
    email: "info@curryhouse.com",
    images: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500"],
    logo: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200",
    rating: { average: 4.6, count: 178 },
    operatingHours: {
      monday: { open: "12:00", close: "22:00", isOpen: true },
      tuesday: { open: "12:00", close: "22:00", isOpen: true },
      wednesday: { open: "12:00", close: "22:00", isOpen: true },
      thursday: { open: "12:00", close: "22:00", isOpen: true },
      friday: { open: "12:00", close: "23:00", isOpen: true },
      saturday: { open: "12:00", close: "23:00", isOpen: true },
      sunday: { open: "12:00", close: "21:00", isOpen: true }
    },
    deliveryInfo: {
      minimumOrder: 18,
      deliveryFee: 3.49,
      deliveryTime: { min: 25, max: 40 },
      deliveryRadius: 6
    },
    isActive: true,
    isVerified: true,
    features: ["delivery", "pickup", "dine_in"],
    paymentMethods: ["cash", "card", "google_pay"]
  }
];

// Sample menu items for each restaurant
const menuItems = [
  // Pizza Palace items
  {
    name: "Margherita Pizza",
    category: "main_course",
    description: "Classic pizza with fresh mozzarella, tomato sauce, and basil",
    price: 14.99,
    originalPrice: 16.99,
    images: ["https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400"],
    ingredients: ["Mozzarella", "Tomato Sauce", "Basil", "Olive Oil"],
    allergens: ["dairy", "wheat"],
    nutritionalInfo: { calories: 850, protein: 35, carbs: 95, fat: 35, fiber: 4, sugar: 8 },
    dietaryTags: ["vegetarian"],
    preparationTime: 15,
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
    customizationOptions: [
      {
        name: "Crust",
        options: [
          { name: "Thin Crust", price: 0 },
          { name: "Regular Crust", price: 0 },
          { name: "Deep Dish", price: 2.00 }
        ]
      },
      {
        name: "Extra Toppings",
        options: [
          { name: "Pepperoni", price: 1.50 },
          { name: "Mushrooms", price: 1.00 },
          { name: "Olives", price: 1.00 }
        ]
      }
    ]
  },
  {
    name: "Pepperoni Supreme",
    category: "main_course",
    description: "Pepperoni pizza with extra cheese and our special sauce",
    price: 16.99,
    originalPrice: 18.99,
    images: ["https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400"],
    ingredients: ["Pepperoni", "Mozzarella", "Tomato Sauce", "Herbs"],
    allergens: ["dairy", "wheat"],
    nutritionalInfo: { calories: 920, protein: 38, carbs: 98, fat: 42, fiber: 3, sugar: 7 },
    dietaryTags: [],
    preparationTime: 18,
    isAvailable: true,
    isPopular: true,
    isFeatured: false
  },
  {
    name: "Garlic Bread",
    category: "appetizer",
    description: "Freshly baked bread with garlic butter and herbs",
    price: 5.99,
    images: ["https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400"],
    ingredients: ["Bread", "Garlic", "Butter", "Parsley"],
    allergens: ["dairy", "wheat"],
    nutritionalInfo: { calories: 320, protein: 8, carbs: 42, fat: 14, fiber: 2, sugar: 2 },
    dietaryTags: ["vegetarian"],
    preparationTime: 8,
    isAvailable: true,
    isPopular: true,
    isFeatured: false
  },

  // Burger Barn items
  {
    name: "Classic Cheeseburger",
    category: "main_course",
    description: "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
    price: 12.99,
    images: ["https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400"],
    ingredients: ["Beef Patty", "Cheese", "Lettuce", "Tomato", "Onion", "Special Sauce"],
    allergens: ["dairy", "wheat", "eggs"],
    nutritionalInfo: { calories: 780, protein: 42, carbs: 45, fat: 48, fiber: 3, sugar: 9 },
    dietaryTags: [],
    preparationTime: 12,
    isAvailable: true,
    isPopular: true,
    isFeatured: true
  },
  {
    name: "Bacon Deluxe",
    category: "main_course",
    description: "Double beef patty with bacon, cheese, and BBQ sauce",
    price: 15.99,
    images: ["https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400"],
    ingredients: ["Double Beef", "Bacon", "Cheese", "BBQ Sauce", "Onion Rings"],
    allergens: ["dairy", "wheat"],
    nutritionalInfo: { calories: 980, protein: 52, carbs: 58, fat: 62, fiber: 2, sugar: 12 },
    dietaryTags: [],
    preparationTime: 15,
    isAvailable: true,
    isPopular: true,
    isFeatured: false
  },
  {
    name: "French Fries",
    category: "side_dish",
    description: "Crispy golden fries with sea salt",
    price: 4.99,
    images: ["https://images.unsplash.com/photo-1634034379073-f689b460a3fc?w=400"],
    ingredients: ["Potatoes", "Vegetable Oil", "Sea Salt"],
    allergens: [],
    nutritionalInfo: { calories: 365, protein: 4, carbs: 63, fat: 14, fiber: 6, sugar: 0 },
    dietaryTags: ["vegetarian", "vegan"],
    preparationTime: 8,
    isAvailable: true,
    isPopular: true,
    isFeatured: false
  },

  // Sushi Sensation items
  {
    name: "California Roll",
    category: "main_course",
    description: "Crab, avocado, and cucumber wrapped in nori and rice",
    price: 8.99,
    images: ["https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400"],
    ingredients: ["Crab", "Avocado", "Cucumber", "Nori", "Rice"],
    allergens: ["shellfish"],
    nutritionalInfo: { calories: 255, protein: 9, carbs: 38, fat: 7, fiber: 3, sugar: 3 },
    dietaryTags: [],
    preparationTime: 10,
    isAvailable: true,
    isPopular: true,
    isFeatured: true
  },
  {
    name: "Salmon Nigiri",
    category: "main_course",
    description: "Fresh salmon slices over seasoned rice",
    price: 12.99,
    images: ["https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400"],
    ingredients: ["Salmon", "Rice", "Vinegar", "Sugar", "Salt"],
    allergens: ["fish"],
    nutritionalInfo: { calories: 180, protein: 12, carbs: 25, fat: 3, fiber: 0, sugar: 2 },
    dietaryTags: [],
    preparationTime: 8,
    isAvailable: true,
    isPopular: true,
    isFeatured: false
  },
  {
    name: "Miso Soup",
    category: "soup",
    description: "Traditional Japanese soup with tofu and seaweed",
    price: 3.99,
    images: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400"],
    ingredients: ["Miso Paste", "Tofu", "Seaweed", "Green Onions"],
    allergens: ["soy"],
    nutritionalInfo: { calories: 85, protein: 6, carbs: 9, fat: 3, fiber: 2, sugar: 2 },
    dietaryTags: ["vegetarian"],
    preparationTime: 5,
    isAvailable: true,
    isPopular: true,
    isFeatured: false
  },

  // Taco Time items
  {
    name: "Carne Asada Tacos",
    category: "main_course",
    description: "Grilled steak tacos with onions, cilantro, and lime",
    price: 9.99,
    images: ["https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400"],
    ingredients: ["Steak", "Corn Tortillas", "Onions", "Cilantro", "Lime"],
    allergens: [],
    nutritionalInfo: { calories: 320, protein: 25, carbs: 28, fat: 12, fiber: 4, sugar: 2 },
    dietaryTags: [],
    preparationTime: 12,
    isAvailable: true,
    isPopular: true,
    isFeatured: true
  },
  {
    name: "Chicken Quesadilla",
    category: "main_course",
    description: "Grilled chicken and cheese in a crispy tortilla",
    price: 11.99,
    images: ["https://images.unsplash.com/photo-16158702381"],
  }
];

module.exports = { restaurants, menuItems };

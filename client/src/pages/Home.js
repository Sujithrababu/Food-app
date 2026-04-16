import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiClock, FiStar, FiTruck } from 'react-icons/fi';

const Home = () => {
  const features = [
    {
      icon: <FiSearch className="w-8 h-8" />,
      title: 'Find Restaurants',
      description: 'Discover amazing restaurants near you with our smart search'
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: 'Fast Delivery',
      description: 'Get your food delivered in minutes, not hours'
    },
    {
      icon: <FiStar className="w-8 h-8" />,
      title: 'Top Quality',
      description: 'Only the best restaurants and food quality guaranteed'
    },
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: 'Track Orders',
      description: 'Real-time tracking of your food delivery'
    }
  ];

  const popularCuisines = [
    { name: 'Italian', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=200&fit=crop' },
    { name: 'Chinese', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop' },
    { name: 'Indian', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop' },
    { name: 'Mexican', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop' },
    { name: 'Japanese', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop' },
    { name: 'American', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Delicious Food
            <span className="block">Delivered to You</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Order from your favorite restaurants and get food delivered right to your doorstep. 
            Fast, fresh, and always delicious.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/restaurants" className="btn bg-white text-orange-500 hover:bg-gray-100 text-lg px-8 py-4">
              Order Now
            </Link>
            <Link to="/register" className="btn border-2 border-white text-white hover:bg-white hover:text-orange-500 text-lg px-8 py-4">
              Join Us
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-10 rounded-full"></div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Find Your Perfect Meal
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, or dishes..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-orange-500 focus:outline-none pr-16"
              />
              <button className="absolute right-2 top-2 bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-colors">
                <FiSearch size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
            Why Choose FoodDelivery?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cuisines */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
            Popular Cuisines
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularCuisines.map((cuisine, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={cuisine.image}
                    alt={cuisine.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                </div>
                <h3 className="font-semibold text-gray-800">{cuisine.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their daily meals. 
            Download our app or order online now!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/restaurants" className="btn bg-white text-orange-500 hover:bg-gray-100 text-lg px-8 py-4">
              Start Ordering
            </Link>
            <Link to="/register" className="btn border-2 border-white text-white hover:bg-white hover:text-orange-500 text-lg px-8 py-4">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

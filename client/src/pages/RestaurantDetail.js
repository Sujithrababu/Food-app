import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const restaurantResponse = await axios.get(`/api/restaurants/${id}`);
        setRestaurant(restaurantResponse.data);

        const menuResponse = await axios.get(`/api/menu/restaurant/${id}`);
        setMenuItems(menuResponse.data);
      } catch (err) {
        setError('Failed to fetch restaurant details or menu');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading restaurant details...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!restaurant) return <div className="text-center mt-10">Restaurant not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">{restaurant.name}</h1>
        <p className="text-center text-gray-600 mb-4">
          {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}
        </p>
        <p className="text-center text-gray-600 mb-8">Phone: {restaurant.phone}</p>

        <h2 className="text-3xl font-semibold mb-6">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.length === 0 && <p className="text-gray-600">No menu items available.</p>}
          {menuItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow p-6">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <p className="text-gray-800 font-bold mb-4">${item.price.toFixed(2)}</p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => alert(`Add to cart: ${item.name}`)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;

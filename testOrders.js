const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const testOrders = async () => {
  try {
    // Login to get token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    const token = loginData.token;

    console.log('Logged in, token:', token.substring(0, 20) + '...');

    // Fetch restaurants to get a valid restaurant ID
    const restaurantsResponse = await fetch('http://localhost:5000/api/restaurants');
    const restaurants = await restaurantsResponse.json();
    const restaurantId = restaurants.length > 0 ? restaurants[0]._id : null;

    if (!restaurantId) {
      console.error('No restaurants found to use for order creation');
      return;
    }

    // Fetch menu items for the restaurant
    const menuResponse = await fetch(`http://localhost:5000/api/menu/restaurant/${restaurantId}`);
    const menuItems = await menuResponse.json();
    const menuItemId = menuItems.length > 0 ? menuItems[0]._id : null;

    if (!menuItemId) {
      console.error('No menu items found to add to cart');
      return;
    }

    // Add item to cart
    const addToCartResponse = await fetch('http://localhost:5000/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        menuItemId,
        quantity: 1
      })
    });
    const cartData = await addToCartResponse.json();
    console.log('Added to cart:', cartData);
    console.log('Cart restaurant:', cartData.restaurant);

    // Create an order from cart
    const createOrderResponse = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        deliveryAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345'
        },
        paymentMethod: 'card'
      })
    });
    const orderData = await createOrderResponse.json();
    console.log('Create order response:', orderData);

    // Get user orders
    const getOrdersResponse = await fetch('http://localhost:5000/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const orders = await getOrdersResponse.json();
    console.log('User orders:', orders);

    // Update order status (assuming orderData._id exists)
    if (orderData._id) {
      const updateStatusResponse = await fetch(`http://localhost:5000/api/orders/${orderData._id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed' })
      });
      const updatedOrder = await updateStatusResponse.json();
      console.log('Updated order status:', updatedOrder);
    }
  } catch (error) {
    console.error('Error testing orders:', error);
  }
};

testOrders();

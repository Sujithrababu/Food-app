const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const testCartOperations = async () => {
  try {
    // First login to get token
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
    
    console.log('Logged in successfully, token:', token.substring(0, 20) + '...');
    
    // Get menu items to find an item ID
    const menuResponse = await fetch('http://localhost:5000/api/menu?available=true');
    const menuItems = await menuResponse.json();
    
    if (menuItems.length > 0) {
      const menuItemId = menuItems[0]._id;
      console.log('Found menu item:', menuItems[0].name);
      
      // Add item to cart
      const addToCartResponse = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          menuItemId: menuItemId,
          quantity: 2
        })
      });
      
      const cartData = await addToCartResponse.json();
      console.log('Add to cart response:', cartData);
      
      // Get cart contents
      const getCartResponse = await fetch('http://localhost:5000/api/cart', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      const cartContents = await getCartResponse.json();
      console.log('Cart contents:', cartContents);
      
    } else {
      console.log('No menu items found');
    }
    
  } catch (error) {
    console.error('Error testing cart operations:', error);
  }
};

testCartOperations();

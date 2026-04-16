const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const registerUser = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+1-555-1234',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345'
        }
      })
    });
    const data = await response.json();
    console.log('Register response:', data);
  } catch (error) {
    console.error('Error registering user:', error);
  }
};

registerUser();

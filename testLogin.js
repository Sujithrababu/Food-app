const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const loginUser = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const data = await response.json();
    console.log('Login response:', data);
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

loginUser();

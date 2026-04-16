const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const loginAdmin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@foodapp.com',
        password: 'admin123'
      })
    });
    const data = await response.json();
    console.log('Admin login response:', data);
  } catch (error) {
    console.error('Error logging in as admin:', error);
  }
};

loginAdmin();

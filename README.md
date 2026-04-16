# 🍕 Food Delivery Application

A comprehensive food delivery application built with Node.js, Express, MongoDB, and React. This application includes all the essential modules for a complete food delivery service.

## ✨ Features

### 🚀 Core Modules
1. **User Management Module** - User registration, authentication, and profile management
2. **Restaurant Management Module** - Restaurant CRUD operations and management
3. **Menu & Food Item Module** - Food items, categories, and menu management
4. **Order Management Module** - Order processing and tracking
5. **Cart & Checkout Module** - Shopping cart and checkout functionality
6. **Payment Module** - Payment processing and management
7. **Delivery Management Module** - Delivery tracking and management
8. **Admin Panel Module** - Administrative dashboard and controls
9. **Notification Module** - Real-time notifications system
10. **Review & Rating Module** - Customer reviews and ratings

### 🎨 Frontend Features
- Modern, responsive React UI with Tailwind CSS
- Beautiful animations and transitions
- Mobile-first design approach
- Real-time updates and notifications
- Interactive maps and location services
- Advanced search and filtering

### 🔧 Backend Features
- RESTful API with Express.js
- JWT authentication and authorization
- Role-based access control
- MongoDB with Mongoose ODM
- File upload and image management
- Rate limiting and security middleware
- Comprehensive error handling

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object Data Modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd foodapp
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/food-delivery-app
JWT_SECRET=your-super-secret-jwt-key-here
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
NODE_ENV=development
PORT=5000
```

### 5. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

### 6. Run the Application

#### Development Mode (Recommended)
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

#### Production Mode
```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant

### Menu Items
- `GET /api/menu` - Get menu items
- `GET /api/menu/:id` - Get menu item by ID
- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove cart item

### Payments
- `POST /api/payments/process` - Process payment
- `GET /api/payments/order/:id` - Get payment details

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/restaurant/:id` - Get restaurant reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/restaurants` - Get all restaurants
- `GET /api/admin/orders` - Get all orders

## 🗄️ Database Schema

The application uses MongoDB with the following main collections:

- **Users** - User accounts and profiles
- **Restaurants** - Restaurant information
- **MenuItems** - Food items and menu
- **Orders** - Customer orders
- **Cart** - Shopping cart items
- **Payments** - Payment transactions
- **Deliveries** - Delivery information
- **Reviews** - Customer reviews and ratings
- **Notifications** - User notifications

## 🔐 User Roles

- **user** - Regular customer
- **restaurant_owner** - Restaurant owner/manager
- **delivery_person** - Delivery personnel
- **admin** - System administrator

## 🎯 Key Features

### For Customers
- Browse restaurants and menus
- Add items to cart
- Place orders with delivery options
- Track order status
- Rate and review restaurants
- Manage profile and preferences

### For Restaurant Owners
- Manage restaurant information
- Add/edit menu items
- View and manage orders
- Track sales and analytics
- Respond to customer reviews

### For Delivery Personnel
- View available deliveries
- Accept delivery assignments
- Update delivery status
- Track delivery progress

### For Administrators
- Manage all users and restaurants
- Monitor system activity
- View analytics and reports
- Handle disputes and issues

## 🚀 Deployment

### Heroku Deployment
```bash
# Add Heroku remote
heroku git:remote -a your-app-name

# Deploy
git push heroku main
```

### Docker Deployment
```bash
# Build Docker image
docker build -t food-delivery-app .

# Run container
docker run -p 5000:5000 food-delivery-app
```

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client
npm test
```

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation and sanitization
- Secure HTTP headers
- Role-based access control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Contact the development team

## 🎉 Acknowledgments

- React team for the amazing framework
- Express.js team for the robust backend framework
- MongoDB team for the excellent database
- All contributors and supporters

---

**Happy coding! 🚀**

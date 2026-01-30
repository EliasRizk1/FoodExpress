// =======================
// IMPORTS & CONFIG
// =======================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// MONGODB CONNECTION
// =======================
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/foodexpress';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// =======================
// SCHEMAS & MODELS
// =======================

// ---- User ----
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ---- Restaurant ----
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  deliveryTime: { type: String, default: '30-40 min' },
  category: { type: String, default: 'Restaurant' },
  isOpen: { type: Boolean, default: true }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// ---- Menu Item ----
const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, default: 'Main Course' },
  isAvailable: { type: Boolean, default: true }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// ---- Order ----
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  phone: { type: String, required: true },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Preparing', 'On the Way', 'Delivered', 'Cancelled']
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// =======================
// ROUTES
// =======================

// ---- Health Check ----
app.get('/', (req, res) => {
  res.json({ message: '🍔 FoodExpress API is running' });
});

// ---- Auth ----
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password, phone, address });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      userId: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---- Restaurants ----
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/restaurants/:id/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurantId: req.params.id });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---- Orders ----
// *NEW ROUTE* - Get all orders for delivery dashboard
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('restaurantId')
      .populate('userId', 'username email phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const {
      userId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      phone
    } = req.body;

    const order = new Order({
      userId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      phone,
      createdAt: new Date(Date.now() + (2 * 60 * 60 * 1000)) 
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('restaurantId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('restaurantId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---- Seed Data ----
app.get('/api/seed', async (req, res) => {
  try {
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    const restaurants = await Restaurant.insertMany([
      {
        name: 'Pizza Palace',
        image:
          'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        rating: 4.5,
        deliveryTime: '30-40 min',
        category: 'Italian'
      },
      {
        name: 'Burger House',
        image:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        rating: 4.3,
        deliveryTime: '25-35 min',
        category: 'Fast Food'
      },
      {
        name: 'Sushi Master',
        image:
          'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        rating: 4.7,
        deliveryTime: '40-50 min',
        category: 'Japanese'
      },
      {
        name: 'Taco Fiesta',
        image:
          'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400',
        rating: 4.6,
        deliveryTime: '20-30 min',
        category: 'Mexican'
      },
      {
        name: 'Vegan Street Food',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLav3IQljmklU1WlRij7HLE3d1Xi6zINDZ4Q&s',
        rating: 4.8,
        deliveryTime: '25-35 min',
        category: 'Vegan'
      }
    ]);

    await MenuItem.insertMany([
      // Pizza Palace
      {
        restaurantId: restaurants[0]._id,
        name: 'Margherita Pizza',
        description: 'Classic cheese pizza',
        price: 12.99,
        image:
          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        category: 'Pizza'
      },
      {
        restaurantId: restaurants[0]._id,
        name: 'Pepperoni Pizza',
        description: 'Spicy pepperoni with cheese',
        price: 10.99,
        image:
          'https://media.istockphoto.com/id/521403691/photo/hot-homemade-pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=PaISuuHcJWTEVoDKNnxaHy7L2BTUkyYZ06hYgzXmTbo='
      },
      {
        restaurantId: restaurants[0]._id,
        name: 'Hawaiian pizza',
        description: 'Tomato sauce,cheese,ham,pineapple',
        price: 13.99,
        image:
          'https://cdn.tasteatlas.com/images/recipes/60f9fa6062694a6b8e0127d578815525.jpg'
      },
      {
        restaurantId: restaurants[0]._id,
        name: 'BBQ chicken',
        description: 'BBQ sauce,chicken,red onions,cheese',
        price: 15.99,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvqRWwMW3OfkITAvFcSgFCLUJ6oDqSU3HIRg&s'
      },
      {
        restaurantId: restaurants[0]._id,
        name: 'Vegetarian pizza',
        description: 'Tomato sauce,cheese,vegetables',
        price: 9.99,
        image:
          'https://www.vindulge.com/wp-content/uploads/2023/02/Vegetarian-Pizza-with-Caramelized-Onions-Mushrooms-Jalapeno-FI.jpg'
      },

      // Burger House
      {
        restaurantId: restaurants[1]._id,
        name: 'Classic Burger',
        description: 'Beef patty with lettuce and tomato',
        price: 9.99,
        image:
          'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
        category: 'Burger'
      },
      {
        restaurantId: restaurants[1]._id,
        name: 'Cheese Burger',
        description: 'Two beef patties with double cheese',
        price: 10.99,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlBRTLEnJmSdBwSC2-JQyO1wqy8sZ5rilYcg&s'
      },
      {
        restaurantId: restaurants[1]._id,
        name: 'Chicken Burger',
        description: ' Crispy fried Chicken fillet with sauces and veggies',
        price: 12.99,
        image:
          'https://media.istockphoto.com/id/521207406/photo/southern-country-fried-chicken-sandwich.jpg?s=612x612&w=0&k=20&c=XfttLSxEO2YAjop4Gy0CIb1L5N_OK1tTKxmkiPr3QD8='
      },
      {
        restaurantId: restaurants[1]._id,
        name: 'Mushroom Swiss burger',
        description: 'Beef patty,sauteed mushrooms,Swiss cheese',
        price: 13.5,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9zXldarbgLN2ExIFLBSYarJHbm5qO5WqTpQ&s'
      },

      // Sushi Master
      {
        restaurantId: restaurants[2]._id,
        name: 'California Roll',
        description: 'Crab, avocado, cucumber',
        price: 14.99,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBXBPh3BGegwQFyL6HmB8k0sUDtKdiUdXVgg&s'
      },
      {
        restaurantId: restaurants[2]._id,
        name: 'Salmon Nigiri',
        description: 'Fresh salmon on rice',
        price: 21.99,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRQM6TpUBqL9_UrqiQ9KaooQ5OMFzyFTV5vA&s'
      },
      {
        restaurantId: restaurants[2]._id,
        name: 'Sashimi',
        description: 'salmon sashimi,tuna sashimi,yellowtail sashimi,squid sashimi',
        price: 49.99,
        image:
          'https://preview.redd.it/vhdfzhsgmsl61.jpg?width=1080&crop=smart&auto=webp&s=f6dc652ba43257caeb6f556c3ad92184b4efa7d7'
      },

      // Taco Fiesta
      {
        restaurantId: restaurants[3]._id,
        name: 'Beef Taco',
        description: 'Spicy beef with lettuce,cheese,onions,tomatoes and avocado',
        price: 6.99,
        image:
          'https://feelgoodfoodie.net/wp-content/uploads/2025/07/Shredded-Beef-Tacos-18.jpg'
      },
      {
        restaurantId: restaurants[3]._id,
        name: 'Chicken Taco',
        description: 'Grilled chicken with salsa',
        price: 6.49,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7ppXMb7ZeIZd_fI_1fGy58Mb6XDkPb4dTbA&s'
      },

      // Vegan Delight
      {
        restaurantId: restaurants[4]._id,
        name: 'Vegan Bowl',
        description: 'Quinoa, chickpeas, veggies,avocado',
        price: 9.99,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbLJyQVR0ichX_JUVfkMIyV8OrgNgddh2WIQ&s'
      },
      {
        restaurantId: restaurants[4]._id,
        name: 'Vegan Wrap',
        description: 'Spinach wrap with hummus',
        price: 8.99,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDJ8xTCpVqmAgJjmhe_4E0wkSoewZxs1g8zA&s'
      }
    ]);

    res.json({ message: 'Demo data seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// =======================
// START SERVER
// =======================
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Server running');
  console.log('👉 Local:   http://localhost:${PORT}');
  console.log('👉 Network: http://10.84.128.242:${PORT}');
});
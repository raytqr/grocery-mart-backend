require('dotenv').config();


const express = require('express');
const app = express();
const db = require('./models'); // Import Sequelize setup from the models folder
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const productRoutes = require('./routes/product');

const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Izinkan akses publik ke folder uploads
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/products', productRoutes);

async function startServer() {
  try {
    // Attempt to authenticate the database connection
    await db.sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // If connection is successful, start the Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
  }
}

// Execute the function to start the application
startServer();
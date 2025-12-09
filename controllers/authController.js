const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // NEW: Import JWT library for token generation

// Register Logic (Remains the same as before)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    
    res.status(201).json({
      message: "User created successfully!",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Login Logic (UPDATED)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3. NEW: Generate Token (Entry Ticket) 🎫
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Token payload (content)
      process.env.JWT_SECRET,             // Secret key from .env file
      { expiresIn: '1h' }                 // Token expires in 1 hour
    );

    // 4. Send token to user
    res.json({ 
      message: "Login successful!", 
      token: token,                       // Token is sent here
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "An error occurred on the server" });
  }
};
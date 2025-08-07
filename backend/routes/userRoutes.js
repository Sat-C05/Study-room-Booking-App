const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/users - Fetches all users for the Admin Panel (Admin Only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: 'Server error fetching users.' });
  }
});

// POST /api/users/register - Handles new user registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }
    
    // Restore the check for duplicate emails
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Check for duplicate usernames
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/users/login - Handles user login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'a_default_secret_key',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// DELETE /api/users/:id - Deletes a user and their bookings (Admin Only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    await Booking.deleteMany({ user: req.params.id });
    res.json({ message: 'User and all associated bookings have been deleted.' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: 'Server error deleting user.' });
  }
});

module.exports = router;
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Register user (vendor or regular)
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, username, phone, password, role } = req.body;

    // Check for missing fields
    if (!name || !email || !username || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicates
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phone }],
    });

    if (existingUser) {
      // Send custom message based on the duplicate
      if (existingUser.username === username) {
        return res.status(409).json({ message: 'Username unavailable, please update' });
      }

      return res.status(409).json({
        message: 'Account already exists. Please login instead.',
        existing: {
          email: existingUser.email,
          username: existingUser.username,
          phone: existingUser.phone,
        },
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      username,
      phone,
      password: hashedPassword,
      role: role || 'user',
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // identifier can be email, username or phone
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }

    // Find user by email, username or phone
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
        { phone: identifier },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Optional: Logout logic (for frontend-only token removal)
exports.logoutUser = (req, res) => {
  // Just clear token on the client
  res.status(200).json({ message: 'User logged out. Clear token on frontend.' });
};

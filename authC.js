const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/*
// 🔐 Helper: Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
*/

// ✅ REGISTER CONTROLLER
// @desc    Register a new User or Vendor
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, username, phone, password, role } = req.body;

    // Check if user already exists (by email, username, or phone)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.username === username
            ? 'Username unavailable, please update.'
            : 'Account already exists. Please login.',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      username,
      phone,
      password: hashedPassword,
      role: role === 'vendor' ? 'vendor' : 'user',
      isApproved: role === 'vendor' ? false : true,
    });

    await newUser.save();

    // Return response
    res.status(201).json({
      message: 'Registration successful!',
      user: {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
        isApproved: newUser.isApproved,
      },
      token: generateToken(newUser),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ LOGIN CONTROLLER
// @desc    Login with email, username, or phone
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { loginInput, password } = req.body;

    // Find user by email, username, or phone
    const user = await User.findOne({
      $or: [
        { email: loginInput },
        { username: loginInput },
        { phone: loginInput },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Return response with token
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        isApproved: user.isApproved,
      },
      token: generateToken(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};

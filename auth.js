
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔐 Helper: Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ✅ @desc    Register a new User or Vendor
// ✅ @route   POST /api/auth/register
const registerUser = async (req, res) => {
  // ✅ try: main registration logic
  try {
    const { name, email, username, phone, password, role } = req.body;

    // ❗ Check for existing email, username, or phone
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phone }],
    });

    if (existingUser) {
      // Handle duplicate values
      return res.status(400).json({
        message:
          existingUser.username === username
            ? 'Username unavailable, please update.'
            : 'Account already exists. Please login.',
      });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({
      name,
      email,
      username,
      phone,
      password: hashedPassword,
      role: role === 'vendor' ? 'vendor' : 'user',
      isApproved: role === 'vendor' ? false : true, // Vendors need admin approval
    });

    await newUser.save();

    // ✅ Return success with token
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
    // ❌ catch: if something fails
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser };

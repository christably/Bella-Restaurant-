cybel@ChristabelAidoo MINGW64 ~/OneDrive/Desktop/advert-platform-backend
$ npm run dev

> advert-platform-backend@1.0.0 dev
> nodemon server.js

[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
node:internal/modules/cjs/loader:1404
  throw err;
  ^

Error: Cannot find module 'jsonwebtoken'
Require stack:
- C:\Users\cybel\OneDrive\Desktop\advert-platform-backend\controllers\authController.js
- C:\Users\cybel\OneDrive\Desktop\advert-platform-backend\routes\authRoutes.js
- C:\Users\cybel\OneDrive\Desktop\advert-platform-backend\server.js
    at Function._resolveFilename (node:internal/modules/cjs/loader:1401:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1057:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1062:22)
    at Function._load (node:internal/modules/cjs/loader:1211:37)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:235:24)
    at Module.require (node:internal/modules/cjs/loader:1487:12)
    at require (node:internal/modules/helpers:135:16)
    at Object.<anonymous> (C:\Users\cybel\OneDrive\Desktop\advert-platform-backend\controllers\authController.js:4:13)
    at Module._compile (node:internal/modules/cjs/loader:1730:14) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    'C:\\Users\\cybel\\OneDrive\\Desktop\\advert-platform-backend\\controllers\\authController.js',        
    'C:\\Users\\cybel\\OneDrive\\Desktop\\advert-platform-backend\\routes\\authRoutes.js',
    'C:\\Users\\cybel\\OneDrive\\Desktop\\advert-platform-backend\\server.js'
  ]
}

Node.js v22.15.1
[nodemon] app crashed - waiting for file changes before starting...
















http://localhost:5000/api/auth/register

{
  "name": "Christabel Aidoo",
  "email": "christabel@example.com",
  "username": "christabeldev",
  "phone": "0541234567",
  "password": "securePassword",
  "role": "vendor"
}





const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper: Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register User or Vendor
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, username, phone, password, role } = req.body;

    // Check if user exists by email, username, or phone
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phone }],
    });

    if (existingUser) {
      if (
        existingUser.email === email ||
        existingUser.username === username ||
        existingUser.phone === phone
      ) {
        return res.status(400).json({
          message:
            existingUser.username === username
              ? 'Username unavailable, please update.'
              : 'Account already exists. Please login.',
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vendor check
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

    // Response
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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser };

const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust path if your model is in another folder

// Middleware to protect private routes
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present and formatted correctly
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token with JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the token payload
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // Attach the user info to the request object
    req.user = user;

    // Continue to the next middleware or controller
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Export the middleware
module.exports = { protect };

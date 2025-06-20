
// routes/protectedRoute.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}!`,
    role: req.user.role,
    id: req.user._id
  });
});

module.exports = router;

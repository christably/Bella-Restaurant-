// routes/protectedRoute.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/admin-area', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}` });
});

router.get('/vendor-area', protect, authorizeRoles('vendor', 'admin'), (req, res) => {
  res.json({ message: `Hello Vendor ${req.user.username}` });
});


router.get('/dashboard', protect, (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}!`,
    role: req.user.role,
    id: req.user._id
  });
});

module.exports = router;

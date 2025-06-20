const loginUser = async (req, res) => {
  try {
    const { email, username, phone, password } = req.body;

    // ❗ Ensure only one login method is used
    const identifiers = [email, username, phone].filter(Boolean);
    if (identifiers.length !== 1) {
      return res.status(400).json({
        message: 'Please provide only one of email, username, or phone along with your password.',
      });
    }

    // 🔍 Find user by the provided identifier
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (username) {
      user = await User.findOne({ username });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // 🔐 Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // ✅ Return token and user info
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

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//  Generate Tokens
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

//  Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      accessToken: generateAccessToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Login (FIXED)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

   res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: false,
  sameSite: 'lax'
});

      res.json({
        _id: user._id,
        email: user.email,
        accessToken
      });

    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};

//  Refresh Token
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newAccessToken = generateAccessToken(decoded.id);

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};
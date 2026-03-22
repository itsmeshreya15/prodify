const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // check header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // get token
const authHeader = req.headers.authorization;
if (authHeader && authHeader.startsWith('Bearer ')) {
  token = authHeader.split(' ')[1];
}

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // get user from DB (without password)
      req.user = await User.findById(decoded.id).select('-password');

      next();

    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No token, not authorized' });
  }
};

module.exports = protect;
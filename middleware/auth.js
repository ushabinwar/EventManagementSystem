const jwt = require('jsonwebtoken');
const User = require('../models/user')

const protect = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'yourSecretKey');
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = protect;

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Put token in request header after login
    // Key: Authorization
    // Value: Bearer yourTokenValue
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch(err) {
    return res.status(401).json({
      message: 'Authorization failed'
    });
  }
};
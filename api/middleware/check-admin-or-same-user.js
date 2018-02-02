const User = require('../models/user');

module.exports = (req, res, next) => {
  // req.userData is mapped in checkAuth middleware
  const userData = req.userData;
  const userId = req.params.userId;

  if (!userData) {
    return res.status(401).json({
      message: 'Authorization failed'
    });
  }

  // If userId in request parameters is the same as the 
  // userId in the web token, proceed...
  if (userId && userId === userData.userId) {
    next();
    return;
  }

  User.findById(userData.userId)
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Authorization failed'
        });
      }
      // If user in token has an administrator role, proceed...
      if (user.role.toLowerCase() === 'administrator') {
        next();
      } else {
        res.status(401).json({
          message: 'Authorization failed'
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}
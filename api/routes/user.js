const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const port = process.env.PORT || 3000;

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({ message: 'Email exists ' });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User created'
                })
              })
              .catch(err => { console.log(err); res.status(500).json({ error: err }); });
          }
        });
      }
    })
});

router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        // Obfuscate fact that user doesn't exist for security reasons
        return res.status(401).json({
          message: 'Authentication failed'
        });
      }

      // Check password by comparing the hashed entered password to the saved hashed password
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) return res.status(401).json({ message: 'Authentication failed' });
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            });
          return res.status(200).json({ 
            message: 'Authentication successful',
            token: token
          });
        }
        res.status(401).json({ message: 'Authentication failed' });
      });

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post('/signout', (req, res, next) => {

});

router.delete('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  User.remove({ _id: userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted',
        request: {
          type: 'POST',
          description: 'Create user',
          url: `http://localhost/${port}/user`,
          body: {
            email: 'String',
            password: 'String'
          }
        }
      });
    })
    .catch(err => { res.status(500).json({ error: err }); });
})

module.exports = router;
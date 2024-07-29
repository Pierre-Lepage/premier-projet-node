const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route POST /users
// @desc Register a user
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  User.findOne({ email })
    .then(user => {
      if (user) return res.status(400).json({ msg: 'User already exists' });

      const newUser = new User({
        name,
        email,
        password
      });

      newUser.save()
        .then(user => {
          res.json({
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          });
        });
    });
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register', {
    error: null,
    title: 'Register',
    name: '',
    email: ''
  });
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', {
        error: 'Email is already registered.',
        name,
        email,
        title: 'Register'
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create the new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

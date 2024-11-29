const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

// ----- REGISTER ROUTE -----
router.get('/register', (req, res) => {
  res.render('register', { error: null, title: 'Register' });
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered.');
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

// ----- LOGIN ROUTE -----
router.get('/login', (req, res) => {
  res.render('login', { error: null, title: 'Login' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    res.redirect('/my-reservations');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ----- LOGOUT ROUTE -----
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).send('Unable to log out.');
    }

    // clear the session cache
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

module.exports = router;

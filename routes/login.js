const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { error: null, title: 'Login' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', {
        error: 'Invalid email or password.',
        title: 'Login'
      });
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', {
        error: 'Invalid email or password.',
        title: 'Login'
      });
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

module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs'); // Library for hashing and comparing passwords
const User = require('../models/user'); // User model for database operations

const router = express.Router(); // Create a new router instance

// GET route to render the login page
router.get('/login', (req, res) => {
  res.render('login', { error: null, title: 'Login' }); // Render the login view with no error initially
});

// POST route to handle login submissions
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', {
        error: 'Invalid email or password.', // Error message for non-existent user
        title: 'Login'
      });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', {
        error: 'Invalid email or password.', // Error message for incorrect password
        title: 'Login'
      });
    }

    // Set user details in the session
    req.session.user = {
      _id: user._id, // User ID
      name: user.name, // User name
      email: user.email, // User email
      userType: user.userType // User type (e.g., admin or regular user)
    };

    res.redirect('/my-reservations'); // Redirect to the "My Reservations" page on successful login
  } catch (error) {
    console.error('Login error:', error); // Log any errors for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// Export the router for use in the main application
module.exports = router;

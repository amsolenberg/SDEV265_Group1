const express = require('express');
const bcrypt = require('bcryptjs'); // Library for hashing passwords
const User = require('../models/user'); // User model for database operations

const router = express.Router(); // Create a new router instance

// GET route to render the registration page
router.get('/register', (req, res) => {
  res.render('register', {
    error: null, // No error initially
    title: 'Register', // Page title
    name: '', // Pre-fill name field with empty string
    email: '' // Pre-fill email field with empty string
  });
});

// POST route to handle registration submissions
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body; // Extract name, email, and password from the request body

  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', {
        error: 'Email is already registered.', // Error message for duplicate email
        name, // Retain previously entered name
        email, // Retain previously entered email
        title: 'Register' // Page title
      });
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

    // Create a new user and save it to the database
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.redirect('/login'); // Redirect to the login page upon successful registration
  } catch (error) {
    console.error('Registration error:', error); // Log any errors for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// Export the router for use in the main application
module.exports = router;

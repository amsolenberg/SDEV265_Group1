const express = require('express');
const bcrypt = require('bcryptjs'); // (Not used here but typically included for authentication utilities)
const User = require('../models/user'); // (Not used here but might be needed for user-related operations elsewhere)

const router = express.Router(); // Create a new router instance

// GET route to handle user logout
router.get('/logout', (req, res) => {
  // Destroy the user's session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err); // Log the error for debugging
      return res.status(500).send('Unable to log out.'); // Respond with an error message if session destruction fails
    }

    // Clear the session cookie
    res.clearCookie('connect.sid'); // Remove the session identifier cookie
    res.redirect('/'); // Redirect the user to the home page after logout
  });
});

// Export the router for use in the main application
module.exports = router;

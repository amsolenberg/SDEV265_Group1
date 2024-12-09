const express = require('express');
const Service = require('../models/service'); // Model for interacting with the Service collection in the database
const router = express.Router(); // Create a new router instance

// GET route to display the homepage
router.get('/', async (req, res) => {
  try {
    // Fetch up to 3 popular services from the database
    const popularServices = await Service.find({ popular: true }).limit(3);

    // Render the homepage with the popular services and a title
    res.render('index', {
      title: 'Home', // Page title
      popularServices // Popular services to display in the homepage
    });
  } catch (err) {
    console.error('Error fetching popular services:', err); // Log any errors for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// GET route to display the privacy policy page
router.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy', { title: 'Privacy Policy' }); // Render the privacy policy view with a title
});

// GET route to display the terms of service page
router.get('/terms', (req, res) => {
  res.render('terms', { title: 'Terms of Service' }); // Render the terms of service view with a title
});

// Export the router for use in the main application
module.exports = router;

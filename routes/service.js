const express = require('express');
const Service = require('../models/service'); // Model for interacting with the Service collection in the database

const router = express.Router(); // Create a new router instance

// GET route to display available services
router.get('/services', async (req, res) => {
  try {
    // Fetch all services from the database
    const services = await Service.find();

    // Render the services view with the fetched services and a title
    res.render('services', { services, title: 'Services' });
  } catch (error) {
    console.error('Error fetching services:', error); // Log any errors for debugging
    res.status(500).send('An error occurred while fetching services.'); // Respond with a generic error message
  }
});

// Export the router for use in the main application
module.exports = router;

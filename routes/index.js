const express = require('express');
const staticRoutes = require('./static'); // Routes for serving static pages
const serviceRoutes = require('./service'); // Routes related to services
const reservationRoutes = require('./reservation'); // Routes related to reservations
const registerRoutes = require('./register'); // Routes for user registration
const loginRoutes = require('./login'); // Routes for user login
const logoutRoutes = require('./logout'); // Routes for user logout
const adminRoutes = require('./adminRoutes'); // Admin-specific routes

const router = express.Router(); // Create a new router instance

// Define routes for various parts of the application
router.use('/', staticRoutes); // Static routes (e.g., home page, about, etc.)
router.use('/', serviceRoutes); // Service-related routes
router.use('/', reservationRoutes); // Reservation-related routes
router.use('/', registerRoutes); // Registration-related routes
router.use('/', loginRoutes); // Login-related routes
router.use('/', logoutRoutes); // Logout-related routes
router.use('/admin', adminRoutes); // Admin-specific routes under '/admin'

// Export the router for use in the main application
module.exports = router;

const express = require('express');
const adminRoutes = express.Router(); // Create a new router instance for admin routes

// Mount routes for admin-specific features
adminRoutes.use('/reservations', require('./admin/reservations')); // Routes for managing reservations
adminRoutes.use('/users', require('./admin/users')); // Routes for managing users
adminRoutes.use('/services', require('./admin/services')); // Routes for managing services

// Export the admin routes for use in the main router
module.exports = adminRoutes;

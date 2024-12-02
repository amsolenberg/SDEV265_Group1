const express = require('express');
const adminRoutes = express.Router();

adminRoutes.use('/reservations', require('./admin/reservations'));
adminRoutes.use('/users', require('./admin/users'));
adminRoutes.use('/services', require('./admin/services'));

module.exports = adminRoutes;
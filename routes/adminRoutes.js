const express = require('express');
const adminRoutes = express.Router();

adminRoutes.use('/reservations', require('./admin/reservations'));
adminRoutes.use('/users', require('./admin/users'));

module.exports = adminRoutes;
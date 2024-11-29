const express = require('express');
const staticRoutes = require('./static');
const serviceRoutes = require('./service');
const reservationRoutes = require('./reservation');
const registerRoutes = require('./register');
const loginRoutes = require('./login');
const logoutRoutes = require('./logout');

const router = express.Router();

router.use('/', staticRoutes);

router.use('/', serviceRoutes);

router.use('/', reservationRoutes);

router.use('/', registerRoutes);

router.use('/', loginRoutes);

router.use('/', logoutRoutes);

module.exports = router;

const express = require('express');
const staticRoutes = require('./static');
const serviceRoutes = require('./service');
const reservationRoutes = require('./reservation');
const authRoutes = require('./auth');

const router = express.Router();

router.use('/', staticRoutes);

router.use('/', serviceRoutes);

router.use('/', reservationRoutes);

router.use('/', authRoutes);

module.exports = router;

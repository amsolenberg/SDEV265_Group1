const express = require('express');
const staticRoutes = require('./static');

const router = express.Router();

router.use('/', staticRoutes);

module.exports = router;
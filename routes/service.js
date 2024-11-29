const express = require('express');
const Service = require('../models/service');

const router = express.Router();

router.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.render('services', { services, title: 'Services' });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).send('An error occured while fetching services.');
  }
});

module.exports = router;

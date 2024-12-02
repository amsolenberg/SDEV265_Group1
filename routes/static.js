const express = require('express');
const Service = require('../models/service')
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const popularServices = await Service.find({popular: true}).limit(3); // Limit to 3 services
        res.render('index', {
            title: 'Home', popularServices,
        });
    } catch (err) {
        console.error('Error fetching popular services:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy', {title: 'Privacy Policy'});
});

router.get('/terms', (req, res) => {
    res.render('terms', {title: 'Terms of Service'});
});

module.exports = router;

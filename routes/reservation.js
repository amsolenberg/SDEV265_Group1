const express = require('express');
const Reservation = require('../models/reservation');
const router = express.Router();

// protect routes
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

router.get('/my-reservations', isAuthenticated, async (req, res) => {
  try {
    const reservations = await Reservation.find({
      userId: req.session.user._id
    });
    res.render('my-reservations', { reservations, title: 'My Reservations' });
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

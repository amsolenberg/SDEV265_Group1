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
    }).sort({ date: 1, time: 1 });

    const currentTime = new Date();
    const enhancedReservations = reservations.map((reservation) => {
      const reservationDateTime = new Date(
        `${reservation.date.toISOString().split('T')[0]}T${reservation.time}`
      );
      return {
        ...reservation._doc,
        isPast: reservationDateTime < currentTime
      };
    });

    res.render('my-reservations', {
      reservations: enhancedReservations,
      title: 'My Reservations'
    });
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).send('Internal Server Error');
  }
});

// route to book a service
router.post('/reservations', isAuthenticated, async (req, res) => {
  const { serviceName, date, time, duration, price } = req.body;

  try {
    // combine date and time into single Date object
    const bookingDateTime = new Date(`${date}T${time}`);
    const currentDateTime = new Date();

    // check if booking date is in the past
    if (bookingDateTime < currentDateTime) {
      req.flash('error', 'You cannot book a service in the past.');
      return res.redirect('/services');
    }

    const reservation = new Reservation({
      userId: req.session.user._id,
      serviceName,
      date: new Date(date),
      time,
      duration,
      price
    });

    await reservation.save();
    req.flash('success', 'Reservation booked successfully!');
    res.redirect('/my-reservations');
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).send('Internal Server Error');
  }
});

// route to delete a service
router.delete('/my-reservations/:id', isAuthenticated, async (req, res) => {
  try {
    const reservationId = req.params.id;

    await Reservation.findByIdAndDelete(reservationId);
    req.flash('success', 'Reservation deleted successfully!');
    res.redirect('/my-reservations');
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

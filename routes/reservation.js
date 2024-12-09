const express = require('express');
const Reservation = require('../models/reservation'); // Model for handling reservation data
const router = express.Router(); // Create a new router instance

// Middleware to protect routes and ensure user authentication
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // User is authenticated, proceed to the next middleware/route handler
  }
  res.redirect('/login'); // Redirect to login if user is not authenticated
}

// GET route to display user's reservations
router.get('/my-reservations', isAuthenticated, async (req, res) => {
  try {
    // Fetch reservations for the logged-in user and sort them by date and time
    const reservations = await Reservation.find({
      userId: req.session.user._id
    }).sort({ date: 1, time: 1 });

    const currentTime = new Date();

    // Enhance reservations with a flag to indicate if they are in the past
    const enhancedReservations = reservations.map((reservation) => {
      const reservationDateTime = new Date(`${reservation.date.toISOString().split('T')[0]}T${reservation.time}`);
      return {
        ...reservation._doc,
        isPast: reservationDateTime < currentTime
      };
    });

    res.render('my-reservations', {
      reservations: enhancedReservations, // Pass enhanced reservations to the view
      title: 'My Reservations' // Page title
    });
  } catch (err) {
    console.error('Error fetching reservations:', err); // Log any errors for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// POST route to book a service
router.post('/reservations', isAuthenticated, async (req, res) => {
  const { serviceName, date, time, duration, price } = req.body; // Extract reservation details from the request body

  try {
    // Combine the date and time into a single Date object
    const bookingDateTime = new Date(`${date}T${time}`);
    const currentDateTime = new Date();

    // Validate that the booking is not in the past
    if (bookingDateTime < currentDateTime) {
      req.flash('error', 'You cannot book a service in the past.'); // Flash error message
      return res.redirect('/services'); // Redirect back to services page
    }

    // Create a new reservation and save it to the database
    const reservation = new Reservation({
      userId: req.session.user._id,
      serviceName,
      date: new Date(date),
      time,
      duration,
      price
    });

    await reservation.save();
    req.flash('success', 'Reservation booked successfully!'); // Flash success message
    res.redirect('/my-reservations'); // Redirect to the user's reservations page
  } catch (err) {
    console.error('Error creating reservation:', err); // Log any errors for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// DELETE route to cancel a reservation
router.delete('/my-reservations/:id', isAuthenticated, async (req, res) => {
  try {
    const reservationId = req.params.id; // Extract reservation ID from the URL parameters

    await Reservation.findByIdAndDelete(reservationId); // Delete the reservation from the database
    req.flash('success', 'Reservation deleted successfully!'); // Flash success message
    res.redirect('/my-reservations'); // Redirect to the user's reservations page
  } catch (error) {
    console.error('Error deleting reservation:', error); // Log any errors for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// Export the router for use in the main application
module.exports = router;

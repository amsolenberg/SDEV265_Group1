const express = require('express');
const Reservation = require('../../models/reservation'); // Reservation model for database operations
const { isAdmin } = require('../../middlewares'); // Middleware to check admin privileges

const router = express.Router(); // Create a new router instance

// GET route to fetch and display all reservations
router.get('/', isAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('userId', 'name email') // Populate user information (name and email)
      .sort({ date: 1, time: 1 }); // Sort reservations by date and time

    res.render('admin/reservations', {
      reservations, // Pass reservations to the view
      title: 'All Reservations' // Page title
    });
  } catch (err) {
    console.error('Error fetching all reservations:', err); // Log errors for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// DELETE route to remove a reservation by ID
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const reservationId = req.params.id; // Extract reservation ID from the URL

    await Reservation.findByIdAndDelete(reservationId); // Delete the reservation from the database
    req.flash('success', 'Reservation deleted successfully!'); // Flash success message
    res.redirect('/admin/reservations'); // Redirect to the reservations list
  } catch (error) {
    console.error('Error deleting reservation:', error); // Log errors for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// GET route to render the edit form for a reservation
router.get('/:id/edit', isAdmin, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id); // Fetch the reservation by ID
    if (!reservation) {
      req.flash('error', 'Reservation not found.'); // Flash error message if reservation doesn't exist
      return res.redirect('/admin/reservations'); // Redirect back to the reservations list
    }
    console.log('Rendering admin/edit-reservation for ID:', req.params.id); // Log for debugging
    res.render('admin/edit-reservation', {
      title: 'Edit Reservations', // Page title
      reservation // Pass reservation data to the view
    });
  } catch (error) {
    console.error('Error fetching reservation:', error); // Log errors for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// PUT route to update a reservation by ID
router.put('/:id', isAdmin, async (req, res) => {
  const { serviceName, date, time, price, duration } = req.body; // Extract reservation details from the request body
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        serviceName,
        date: new Date(date), // Convert date to a Date object
        time,
        price,
        duration
      },
      { new: true } // Return the updated document
    );
    if (!updatedReservation) {
      req.flash('error', 'Reservation not found.'); // Flash error message if reservation doesn't exist
      return res.redirect('/admin/reservations'); // Redirect back to the reservations list
    }
    req.flash('success', 'Reservation updated successfully.'); // Flash success message
    res.redirect('/admin/reservations'); // Redirect to the reservations list
  } catch (error) {
    console.error('Error updating reservation:', error); // Log errors for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// Export the router for use in the main application
module.exports = router;

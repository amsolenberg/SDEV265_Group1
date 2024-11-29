const express = require('express');
const Reservation = require('../models/reservation');
const { isAdmin } = require('../middlewares');

const router = express.Router();

router.get('/reservations', isAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('userId', 'name email')
      .sort({ date: 1, time: 1 });
    res.render('admin/reservations', {
      reservations,
      title: 'All Reservations'
    });
  } catch (err) {
    console.error('Error fetching all reservations:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/reservations/:id', isAdmin, async (req, res) => {
  try {
    const reservationId = req.params.id;

    await Reservation.findByIdAndDelete(reservationId);
    req.flash('success', 'Reservation deleted successfully!');
    res.redirect('/admin/reservations');
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/reservations/:id/edit', isAdmin, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      req.flash('error', 'Reservation not found.');
      return res.redirect('/admin/reservations');
    }
    console.log('Rendering admin/edit-reservation for ID:', req.params.id);
    res.render('admin/edit-reservation', {
      title: 'Edit Reservations',
      reservation,
    });
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/reservations/:id', isAdmin, async (req, res) => {
  const { serviceName, date, time, price, duration } = req.body;
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        serviceName,
        date: new Date(date),
        time,
        price,
        duration
      },
      { new: true }
    );
    if (!updatedReservation) {
      req.flash('error', 'Reservation not found.');
      return res.redirect('/admin/reservations');
    }
    req.flash('success', 'Reservation updated successfully.');
    res.redirect('/admin/reservations');
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

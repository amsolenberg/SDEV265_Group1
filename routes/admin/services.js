const express = require('express');
const router = express.Router();
const Service = require('../../models/service'); // Model for handling service data
const { isAdmin } = require('../../middlewares'); // Middleware to verify admin privileges
const upload = require('../../middleware/upload'); // Middleware for handling image uploads

// GET route to list all services
router.get('/', isAdmin, async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 }); // Fetch all services, sorted by creation date (newest first)
    res.render('admin/manage-services', { title: 'Manage Services', services }); // Render the manage-services view with fetched services
  } catch (err) {
    console.error('Error fetching services:', err); // Log error for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// GET route to render the service creation form
router.get('/create', isAdmin, (req, res) => {
  res.render('admin/create-service', { title: 'Create Service' }); // Render the create-service view
});

// POST route to create a new service
router.post('/', isAdmin, upload.single('image'), async (req, res) => {
  const { name, description, duration, price, popular } = req.body; // Extract service details from the request body
  try {
    // Create a new service instance with provided data
    const newService = new Service({
      name,
      description,
      duration,
      price,
      image: req.file ? `/images/services/${req.file.filename}` : '/images/services/placeholder.webp', // Use uploaded image or default placeholder
      popular: popular === 'on' // Convert checkbox value to boolean
    });
    await newService.save(); // Save the service to the database
    req.flash('success', `Service "${newService.name}" has been created.`); // Flash success message
    res.redirect('/admin/services'); // Redirect to the services management page
  } catch (err) {
    console.error('Error creating service:', err); // Log error for debugging
    req.flash('error', 'Failed to create service.'); // Flash error message
    res.redirect('/admin/services/create'); // Redirect back to the service creation form
  }
});

// GET route to render the service edit form
router.get('/:id/edit', isAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id); // Fetch the service by ID
    if (!service) {
      req.flash('error', 'Service not found.'); // Flash error message if service doesn't exist
      return res.redirect('/admin/services'); // Redirect back to the services management page
    }
    res.render('admin/edit-service', { title: 'Edit Service', service }); // Render the edit-service view with fetched service data
  } catch (err) {
    console.error('Error fetching service:', err); // Log error for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// PUT route to update a service
router.put('/:id', isAdmin, upload.single('image'), async (req, res) => {
  const { name, description, duration, price, popular } = req.body; // Extract updated service details
  const updates = {
    name,
    description,
    duration,
    price,
    popular: popular === 'on' // Convert checkbox value to boolean
  };

  if (req.file) {
    updates.image = `/images/services/${req.file.filename}`; // Update image if a new one is uploaded
  }

  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, updates, { new: true }); // Update the service in the database
    if (!updatedService) {
      req.flash('error', 'Service not found.'); // Flash error message if service doesn't exist
      return res.redirect('/admin/services'); // Redirect back to the services management page
    }
    req.flash('success', `Service "${updatedService.name}" has been updated.`); // Flash success message
    res.redirect('/admin/services'); // Redirect to the services management page
  } catch (err) {
    console.error('Error updating service:', err); // Log error for debugging
    req.flash('error', 'Failed to update service.'); // Flash error message
    res.redirect(`/admin/services/${req.params.id}/edit`); // Redirect back to the edit form
  }
});

// DELETE route to delete a service
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id); // Delete the service from the database
    if (!service) {
      req.flash('error', 'Service not found.'); // Flash error message if service doesn't exist
      return res.redirect('/admin/services'); // Redirect back to the services management page
    }
    req.flash('success', `Service "${service.name}" has been deleted.`); // Flash success message
    res.redirect('/admin/services'); // Redirect to the services management page
  } catch (err) {
    console.error('Error deleting service:', err); // Log error for debugging
    req.flash('error', 'Failed to delete service.'); // Flash error message
    res.redirect('/admin/services'); // Redirect back to the services management page
  }
});

// Export the router for use in the main application
module.exports = router;

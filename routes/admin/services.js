const express = require('express');
const router = express.Router();
const Service = require('../../models/service');
const {isAdmin} = require('../../middlewares');
const upload = require('../../middleware/upload');

// GET list all services
router.get('/', isAdmin, async (req, res) => {
    try {
        const services = await Service.find().sort({createdAt: -1});
        res.render('admin/manage-services', {title: 'Manage Services', services});
    } catch (err) {
        console.error('Error fetching services:', err);
        res.status(500).send('Internal Server Error');
    }
});

// GET render `admin/create-service`
router.get('/create', isAdmin, (req, res) => {
    res.render('admin/create-service', {title: 'Create Service'});
});

// POST create a new service
router.post('/', isAdmin, upload.single('image'), async (req, res) => {
    const {name, description, duration, price, popular} = req.body;
    try {
        const newService = new Service({
            name,
            description,
            duration,
            price,
            image: req.file ? `/images/services/${req.file.filename}` : '/images/services/placeholder.webp',
            popular: popular === 'on', // Checkbox value
        });
        await newService.save();
        req.flash('success', `Service "${newService.name}" has been created.`);
        res.redirect('/admin/services');
    } catch (err) {
        console.error('Error creating service:', err);
        req.flash('error', 'Failed to create service.');
        res.redirect('/admin/services/create');
    }
});

// GET render `admin/edit-service`
router.get('/:id/edit', isAdmin, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            req.flash('error', 'Service not found.');
            return res.redirect('/admin/services');
        }
        res.render('admin/edit-service', {title: 'Edit Service', service});
    } catch (err) {
        console.error('Error fetching service:', err);
        res.status(500).send('Internal Server Error');
    }
});

// PUT update a service
router.put('/:id', isAdmin, upload.single('image'), async (req, res) => {
    const {name, description, duration, price, popular} = req.body;
    const updates = {
        name, description, duration, price, popular: popular === 'on', // Checkbox value
    };

    if (req.file) {
        updates.image = `/images/services/${req.file.filename}`;
    }

    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, updates, {new: true});
        if (!updatedService) {
            req.flash('error', 'Service not found.');
            return res.redirect('/admin/services');
        }
        req.flash('success', `Service "${updatedService.name}" has been updated.`);
        res.redirect('/admin/services');
    } catch (err) {
        console.error('Error updating service:', err);
        req.flash('error', 'Failed to update service.');
        res.redirect(`/admin/services/${req.params.id}/edit`);
    }
});

// DELETE delete a service
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            req.flash('error', 'Service not found.');
            return res.redirect('/admin/services');
        }
        req.flash('success', `Service "${service.name}" has been deleted.`);
        res.redirect('/admin/services');
    } catch (err) {
        console.error('Error deleting service:', err);
        req.flash('error', 'Failed to delete service.');
        res.redirect('/admin/services');
    }
});

module.exports = router;

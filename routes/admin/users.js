const express = require('express');
const User = require('../../models/user');
const {isAdmin} = require('../../middlewares');
const router = express.Router();
const bcrypt = require('bcryptjs');

// list all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({createdAt: -1});
        res.render('admin/manage-users', {title: 'Manage Users', users});
    } catch (err) {
        console.error('Error fetching users', err);
        res.status(500).send('Internal Server Error');
    }
})

// render the `create user` form
router.get('/new', isAdmin, async (req, res) => {
    res.render('admin/create-user', {title: 'Create User'})
})

// create a user
router.post('/', async (req, res) => {
    const {name, email, password, userType} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            req.flash('error', 'User already exists');
            return res.redirect('/admin/users/new');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, password: hashedPassword, userType: userType || 'user'});
        await newUser.save();

        req.flash('success', `User ${newUser.name} has been added successfully`);
        res.redirect('/admin/users');
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
})

// edit a user
router.get('/:id/edit', isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/admin/users');
        }
        res.render('admin/edit-user', {title: 'Edit User', user: user});
    } catch (err) {
        console.error('Error fetching user', err);
        res.status(500).send('Internal Server Error');
    }
})

// update a user
router.put('/:id', isAdmin, async (req, res) => {
    const {name, email, userType} = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {name, email, userType},
            {new: true}
        );
        if (!updatedUser) {
            req.flash('error', 'User not found');
            return res.redirect('/admin/users');
        }
        req.flash('success', 'User successfully updated');
        res.redirect('/admin/users');
    } catch (err) {
        console.error('Error updating user', err);
        res.status(500).send('Internal Server Error');
    }
})

// delete a user
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        if (req.session.user._id === req.params.id) {
            req.flash('error', 'You cannot delete your own account.');
            return res.redirect('/admin/users');
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/admin/users');
        }
        req.flash('success', 'User successfully deleted');
        res.redirect('/admin/users');
    } catch (err) {
        console.error('Error deleting user', err);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;
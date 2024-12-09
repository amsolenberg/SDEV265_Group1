const express = require('express');
const User = require('../../models/user'); // User model for database operations
const { isAdmin } = require('../../middlewares'); // Middleware to check for admin privileges
const router = express.Router(); // Create a new router instance
const bcrypt = require('bcryptjs'); // Library for hashing passwords

// GET route to list all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // Fetch all users, sorted by creation date (newest first)
    res.render('admin/manage-users', { title: 'Manage Users', users }); // Render the manage-users view with fetched users
  } catch (err) {
    console.error('Error fetching users', err); // Log error for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// GET route to render the `create user` form
router.get('/new', isAdmin, async (req, res) => {
  res.render('admin/create-user', { title: 'Create User' }); // Render the create-user view
});

// POST route to create a new user
router.post('/', async (req, res) => {
  const { name, email, password, userType } = req.body; // Extract user details from the request body
  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'User already exists'); // Flash error message for duplicate user
      return res.redirect('/admin/users/new'); // Redirect back to the user creation form
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userType: userType || 'user' // Default to 'user' if userType is not provided
    });
    await newUser.save(); // Save the new user to the database

    req.flash('success', `User ${newUser.name} has been added successfully`); // Flash success message
    res.redirect('/admin/users'); // Redirect to the users management page
  } catch (err) {
    console.error('Error creating user:', err); // Log error for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// GET route to render the `edit user` form
router.get('/:id/edit', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Fetch the user by ID
    if (!user) {
      req.flash('error', 'User not found'); // Flash error message if user doesn't exist
      return res.redirect('/admin/users'); // Redirect back to the users management page
    }
    res.render('admin/edit-user', { title: 'Edit User', user }); // Render the edit-user view with fetched user data
  } catch (err) {
    console.error('Error fetching user', err); // Log error for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// PUT route to update a user
router.put('/:id', isAdmin, async (req, res) => {
  const { name, email, userType } = req.body; // Extract updated user details
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, userType },
      { new: true } // Return the updated document
    );
    if (!updatedUser) {
      req.flash('error', 'User not found'); // Flash error message if user doesn't exist
      return res.redirect('/admin/users'); // Redirect back to the users management page
    }
    req.flash('success', 'User successfully updated'); // Flash success message
    res.redirect('/admin/users'); // Redirect to the users management page
  } catch (err) {
    console.error('Error updating user', err); // Log error for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// DELETE route to delete a user
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    // Prevent the admin from deleting their own account
    if (req.session.user._id === req.params.id) {
      req.flash('error', 'You cannot delete your own account.'); // Flash error message
      return res.redirect('/admin/users'); // Redirect back to the users management page
    }

    const user = await User.findByIdAndDelete(req.params.id); // Delete the user from the database
    if (!user) {
      req.flash('error', 'User not found'); // Flash error message if user doesn't exist
      return res.redirect('/admin/users'); // Redirect back to the users management page
    }
    req.flash('success', 'User successfully deleted'); // Flash success message
    res.redirect('/admin/users'); // Redirect to the users management page
  } catch (err) {
    console.error('Error deleting user', err); // Log error for debugging
    res.status(500).send('Internal Server Error'); // Respond with a generic error message
  }
});

// Export the router for use in the main application
module.exports = router;

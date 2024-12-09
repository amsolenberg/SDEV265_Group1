const express = require('express'); // Import Express for middleware and routing
const morgan = require('morgan'); // Import Morgan for HTTP request logging
const methodOverride = require('method-override'); // Import Method Override for supporting PUT/DELETE methods
const session = require('express-session'); // Import Express-Session for managing user sessions
const flash = require('connect-flash'); // Import Connect-Flash for flash messages

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  // Uncomment below to debug session user data
  // console.log('Session User:', req.session.user);
  if (
    req.session &&
    req.session.user &&
    req.session.user.userType === 'admin' // Check if the user type is 'admin'
  ) {
    return next(); // Proceed to the next middleware/route handler
  }
  req.flash('error', 'Unauthorized Access'); // Flash an error message for unauthorized access
  res.redirect('/'); // Redirect to the home page
}

module.exports = (app) => {
  // Serve static files from the `public` directory
  app.use(express.static('public'));

  // Parse URL-encoded data from forms
  app.use(express.urlencoded({ extended: true }));

  // HTTP request logging in development mode
  app.use(morgan('dev'));

  // Parse JSON bodies
  app.use(express.json());

  // Enable method override for supporting PUT and DELETE methods
  app.use(methodOverride('_method'));

  // Set up session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET, // Secret key for signing the session ID cookie
      resave: false, // Prevent session resaving if it hasn't changed
      saveUninitialized: true, // Save uninitialized sessions
      cookie: { secure: false } // Use secure cookies only in production
    })
  );

  // Enable flash messages for user feedback
  app.use(flash());

  // Pass session data and flash messages to all templates
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // Pass the logged-in user to templates
    res.locals.success = req.flash('success'); // Pass success flash messages
    res.locals.error = req.flash('error'); // Pass error flash messages
    next(); // Proceed to the next middleware
  });

  // Attach `isAdmin` middleware for use in routes
  app.isAdmin = isAdmin;
};

// Export `isAdmin` for external use
module.exports.isAdmin = isAdmin;

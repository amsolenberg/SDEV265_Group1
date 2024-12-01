const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

function isAdmin(req, res, next) {
  // console.log('Session User:', req.session.user); // log session user for debugging
  if (
    req.session &&
    req.session.user &&
    req.session.user.userType === 'admin'
  ) {
    return next();
  }
  req.flash('error', 'Unauthorized Access');
  res.redirect('/');
}

module.exports = (app) => {
  // serve static files
  app.use(express.static('public'));

  // for parsing url-encoded data
  app.use(express.urlencoded({ extended: true }));

  // logging middleware
  app.use(morgan('dev'));

  // parse JSON bodies
  app.use(express.json());

  // enable method override
  app.use(methodOverride('_method'));

  // user sessions
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    })
  );

  app.use(flash());

  // pass logged in user to all templates
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  });

  // export `isAdmin` for use in routes
  app.isAdmin = isAdmin;
};

module.exports.isAdmin = isAdmin;

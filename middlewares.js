const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');

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
      secret: 'my_secret_key',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    })
  );

  // pass logged in user to all templates
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });
};

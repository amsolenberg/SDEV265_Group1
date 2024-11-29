const express = require('express');
const morgan = require('morgan');

module.exports = (app) => {
  // serve static files
  app.use(express.static('public'));

  // for parsing url-encoded data
  app.use(express.urlencoded({ extended: true }));

  // logging middleware
  app.use(morgan('dev'));
};

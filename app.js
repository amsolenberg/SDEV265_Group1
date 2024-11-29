const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const connectToDB = require('./db');
const configureMiddlewares = require('./middlewares');
const routes = require('./routes');

const app = express();
const port = 3000;

// ----- ENVIRONMENT VARIABLES -----
// function to load a specific .env file from the env/ directory
const loadEnvFile = (filename) => {
  const filePath = path.resolve(__dirname, 'env', filename);
  const result = dotenv.config({ path: filePath });
  if (result.error) {
    console.error(`Failed to load ${filename}:`, result.error);
  } else {
    console.log(`Loaded environment variables from ${filename}`);
  }
};

// load environment variables
loadEnvFile('database.env');

// validate required environment variables
const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];
const missingVars = requiredVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  );
  process.exit(1);
}

// ----- MIDDLEWARES -----
configureMiddlewares(app);

// ----- VIEW ENGINE -----
// set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ----- DATABASE -----
// connect to the MongoDB database using environment variables
// server starts only if the database connection is successful
connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start the server:', err);
  });

// ----- ROUTES -----
// attach application routes
// main route handler processes incoming requests
app.use('/', routes);

// ----- 404 HANDLER -----
// catch all undefined routes and render a custom 404 page
// must be placed after all other route handlers
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

// ----- GLOBAL ERROR HANDLER -----
// handle unexpected errors gracefully
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send('Something went wrong!');
});

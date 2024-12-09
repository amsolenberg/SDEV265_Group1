const express = require('express'); // Import the Express framework for building web applications.
const dotenv = require('dotenv'); // Import dotenv to load environment variables from a .env file.
const path = require('path'); // Import path for handling file and directory paths.

const connectToDB = require('./db'); // Import a custom module to connect to the database.
const configureMiddlewares = require('./middlewares'); // Import a custom module to configure middlewares.
const routes = require('./routes'); // Import the application's route definitions.

const app = express(); // Create an Express application instance.
const port = 3000; // Define the port number for the server to listen on.

const result = dotenv.config(); // Load environment variables from a .env file.

if (result.error) {
  // If there was an error loading the .env file, log the error and exit the process.
  console.error('Failed to load .env file:', result.error);
  process.exit(1); // Exit with a non-zero code to indicate an error.
} else {
  console.log('Loaded environment variables from .env');
}

// Define the required environment variables for the application.
const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'SESSION_SECRET'];
// Check for missing environment variables.
const missingVars = requiredVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  // Log missing variables and exit if any are not defined.
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Apply middleware configurations from the custom module.
configureMiddlewares(app);

// Set EJS as the view engine for rendering templates.
app.set('view engine', 'ejs');
// Define the directory for EJS templates.
app.set('views', path.join(__dirname, 'views'));

// Connect to the database.
connectToDB()
  .then(() => {
    // Start the server if the database connection is successful.
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    // Log an error if the database connection fails and prevent the server from starting.
    console.error('Failed to start the server:', err);
  });

// Use the main application routes.
app.use('/', routes);

// Handle 404 errors by rendering a custom "404" page.
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

// Global error handler to catch unhandled errors.
// Logs the error stack and sends a 500 response by default.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send('Something went wrong!');
});

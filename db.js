const mongoose = require('mongoose'); // Import Mongoose, a MongoDB library for object data modeling (ODM).

// Function to build the MongoDB connection URI using environment variables.
const buildMongoURI = () => {
  const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env; // Destructure MongoDB-related environment variables.

  // Check if all required environment variables are present.
  if (!DB_USER || !DB_PASS || !DB_HOST || !DB_PORT || !DB_NAME) {
    console.error('Missing required MongoDB environment variables.'); // Log an error if any variables are missing.
    process.exit(1); // Exit the application if the required variables are not defined.
  }

  // Construct and return the MongoDB connection string.
  return `mongodb://${DB_USER}:${encodeURIComponent(DB_PASS)}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
};

// Function to connect to the MongoDB database.
const connectToDB = async () => {
  try {
    const dbURI = buildMongoURI(); // Build the connection URI.
    await mongoose.connect(dbURI); // Attempt to connect to MongoDB using Mongoose.
    console.log('Connected to MongoDB'); // Log a success message if the connection is successful.
  } catch (err) {
    console.error('Database connection error:', err.message || err); // Log the error if the connection fails.
    process.exit(1); // Exit the application if the database connection fails.
  }
};

// Export the database connection function for use in other modules.
module.exports = connectToDB;

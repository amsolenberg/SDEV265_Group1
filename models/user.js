const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions
const Schema = mongoose.Schema; // Define a schema using Mongoose

// Define the schema for users
const userSchema = new Schema(
  {
    name: {
      type: String, // Full name of the user
      required: true // Ensure this field is mandatory
    },
    email: {
      type: String, // User's email address
      required: true // Ensure this field is mandatory
    },
    password: {
      type: String, // Hashed password of the user
      required: true // Ensure this field is mandatory
    },
    userType: {
      type: String, // Role of the user, either 'user' or 'admin'
      enum: ['user', 'admin'], // Limit possible values to 'user' or 'admin'
      default: 'user' // Default role is 'user'
    }
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User; // Export the model for use in other parts of the application

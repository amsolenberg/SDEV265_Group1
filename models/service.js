const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions
const Schema = mongoose.Schema; // Define a schema using Mongoose

// Define the schema for services
const serviceSchema = new Schema(
  {
    name: {
      type: String, // Name of the service
      required: true // Ensure this field is mandatory
    },
    description: {
      type: String, // Detailed description of the service
      required: true // Ensure this field is mandatory
    },
    duration: {
      type: Number, // Duration of the service in minutes
      required: true // Ensure this field is mandatory
    },
    price: {
      type: Number, // Price of the service
      required: true // Ensure this field is mandatory
    },
    image: {
      type: String // URL or path to the image representing the service
    },
    popular: {
      type: Boolean, // Flag indicating whether the service is popular
      default: false // Default value is `false`
    }
  },
  {
    timestamps: true // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Create the Service model based on the schema
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service; // Export the model for use in other parts of the application

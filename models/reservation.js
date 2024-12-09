const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions
const Schema = mongoose.Schema; // Define a schema using Mongoose

// Define the schema for reservations
const reservationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // Reference to a user in the User collection
      ref: 'User', // Define the collection being referenced
      required: true // Ensure this field is mandatory
    },
    serviceName: {
      type: String, // Name of the service reserved
      required: true // Ensure this field is mandatory
    },
    date: {
      type: Date, // Date of the reservation
      required: true // Ensure this field is mandatory
    },
    time: {
      type: String, // Time of the reservation
      required: true // Ensure this field is mandatory
    },
    duration: {
      type: Number, // Duration of the service in minutes
      required: true // Ensure this field is mandatory
    },
    price: {
      type: Number, // Price of the service
      required: true // Ensure this field is mandatory
    }
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);

// Create the Reservation model based on the schema
const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation; // Export the model for use in other parts of the application

const multer = require('multer'); // Import Multer for handling file uploads
const path = require('path'); // Import path module for working with file paths

// Define storage configuration for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination directory for uploaded files
    cb(null, path.join(__dirname, '../public/images/services/'));
  },
  filename: (req, file, cb) => {
    // Create a unique filename using the current timestamp and a random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Append original file name
  }
});

// Define file filter to restrict uploads to image files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file if it is an image
  } else {
    cb(new Error('Only image files are allowed!'), false); // Reject non-image files
  }
};

// Create an instance of Multer with storage, file filter, and size limit configurations
const upload = multer({
  storage, // Use the defined storage configuration
  fileFilter, // Use the defined file filter
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

module.exports = upload; // Export the Multer instance for use in other parts of the application

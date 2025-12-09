const multer = require('multer');
const path = require('path');

// 1. Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define the destination folder for uploaded files
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Create a unique filename: timestamp + random number + original extension
        // Example: 163456789-image.jpg to prevent overwriting
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. Initialize Multer
const upload = multer({ storage: storage });

module.exports = upload;
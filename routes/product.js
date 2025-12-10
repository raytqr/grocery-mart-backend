const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authentication = require('../middlewares/authentication');
const upload = require('../middlewares/upload'); // 1. Impor middleware Multer

// Route for listing all products (GET /products)
router.get('/', productController.getProducts);

// Route for getting a single product by ID (GET /products/:id)
router.get('/:id', productController.getProductById);

// Route for creating a new product (POST /products)
// Apply authentication middleware and upload middleware for images
// 'images' is the field name in the form data, and we allow up to 5 images 
router.post('/', authentication, upload.array('images', 5), productController.createProduct);

module.exports = router;
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authentication = require('../middlewares/authentication');
const upload = require('../middlewares/upload'); // 1. Impor middleware Multer

// Route for listing all products (GET /products)
router.get('/', productController.getProducts);

// Route for getting a single product by ID (GET /products/:id)
router.get('/:id', productController.getProductById);

// 2. Sisipkan upload.single('image')
// 'image' adalah nama field key yang nanti kita pakai di Postman
router.post('/', authentication, upload.single('image'), productController.createProduct);

module.exports = router;
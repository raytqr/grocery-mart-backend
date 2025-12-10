const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authentication = require('../middlewares/authentication'); 
const transactionController = require('../controllers/transactionController');

// Apply middleware BEFORE the controller
router.post('/', authentication, cartController.addToCart);
router.get('/', authentication, cartController.getCart);

// Update uses PUT with ID param
router.put('/:id', authentication, cartController.updateCartItem);

// Delete uses DELETE with ID param
router.delete('/:id', authentication, cartController.removeFromCart);

// Checkout route
router.post('/checkout', authentication, cartController.checkout);

// Order History route
router.get('/history', authentication, transactionController.getHistory);

// Get specific transaction detail
router.get('/history/:id', authentication, transactionController.getTransactionById);

module.exports = router;
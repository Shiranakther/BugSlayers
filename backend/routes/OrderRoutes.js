const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders with populated category and subcategory names
router.get('/', orderController.getAllOrders);

// Create a new order
router.post('/', orderController.createOrder);

// Update an existing order by ID
router.put('/:id', orderController.updateOrder);

// Delete an order by ID
router.delete('/:id', orderController.deleteOrder);

// Get orders filtered by date range for report (populated category and subcategory)
router.get('/report', orderController.getOrderReport);

module.exports = router;

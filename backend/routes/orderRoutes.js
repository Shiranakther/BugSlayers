const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET all orders
router.get('/', orderController.getAllOrders);

// POST create order
router.post('/', orderController.createOrder);

// PUT update order by id
router.put('/:id', orderController.updateOrder);

// DELETE order by id
router.delete('/:id', orderController.deleteOrder);

// GET report by date range (optional)
router.get('/report', orderController.getOrdersByDateRange);

module.exports = router;

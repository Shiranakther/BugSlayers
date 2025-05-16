const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController'); // Import the controller

// Route to get all categories
router.get('/categories', catalogController.getCategories);

// Route to get products by categoryId (categoryId is expected in the query parameter)
router.get('/products', catalogController.getProductsByCategory);

router.get('/search', catalogController.getProductsBySearch);

module.exports = router;

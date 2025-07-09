// routes/productSalesRoutes.js
const express = require('express');
const router = express.Router();
const ProductSales = require('../models/productSalesModel');

router.post('/productsales', async (req, res) => {
  const salesArray = req.body; // expect array of sales items

  try {
    // Add salesId in schema with pre-save hook (like I showed you earlier)
    const savedSales = await ProductSales.insertMany(salesArray);
    res.status(201).json(savedSales);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save product sales', error: err.message });
  }
});

module.exports = router;

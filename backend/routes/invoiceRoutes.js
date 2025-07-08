const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Create invoice
router.post('/', invoiceController.createInvoice);

// Fetch all invoices
router.get('/', invoiceController.getAllInvoices);

module.exports = router;

const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById); // 🆕 Get single invoice
router.put('/:id', invoiceController.updateInvoice);  // 🆕 Update invoice
router.delete('/:id', invoiceController.deleteInvoice); // 🆕 Delete invoice

module.exports = router;

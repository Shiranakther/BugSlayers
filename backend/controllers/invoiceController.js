// controllers/invoiceController.js
const Invoice = require('../models/invoice');

// Generate a numeric invoice ID
const generateInvoiceId = async () => {
  return Date.now().toString();
};

// Create invoice
exports.createInvoice = async (req, res) => {
  try {
    const invoiceId = await generateInvoiceId();
    const invoiceData = { ...req.body, invoiceId };
    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    console.error("Error saving invoice:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    console.error("Error fetching invoices:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    console.error("Error fetching invoice:", err.message);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Invoice not found' });
    res.json(updated);
  } catch (err) {
    console.error("Error updating invoice:", err.message);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    console.error("Error deleting invoice:", err.message);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
};


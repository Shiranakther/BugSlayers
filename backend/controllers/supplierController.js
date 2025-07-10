const Supplier = require('../models/Supplier');

// Get all suppliers with optional search and filter
const getSuppliers = async (req, res) => {
  try {
    const { search, filter } = req.query;
    let query = {};

    if (search) {
      query.supplierName = { $regex: search, $options: 'i' };
    }

    if (filter) {
      query.supplyProducts = { $regex: filter, $options: 'i' };
    }

    const suppliers = await Supplier.find(query);
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving suppliers', error: error.message });
  }
};

// Get supplier count
const getSupplierCount = async (req, res) => {
  try {
    const count = await Supplier.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single supplier by ID
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving supplier', error: error.message });
  }
};

// Create a new supplier
const createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier({
      date: req.body.date,
      supplierName: req.body.supplierName,
      phone1: req.body.phone1,
      phone2: req.body.phone2,
      fax: req.body.fax,
      email: req.body.email,
      address: req.body.address,
      supplyProducts: req.body.supplyProducts,
      paymentTerms: req.body.paymentTerms
    });

    const newSupplier = await supplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: 'Error creating supplier', error: error.message });
  }
};

// Update a supplier by ID
const updateSupplier = async (req, res) => {
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedSupplier) {
          res.json(updatedSupplier);
        } else {
          res.status(404).json({ message: 'Supplier not found' });
        }
      } catch (error) {
        res.status(400).json({ message: 'Error updating supplier', error: error.message });
      }
}

// Delete a supplier by ID
const deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (deletedSupplier) {
      res.json({ message: 'Supplier deleted successfully' });
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supplier', error: error.message });
  }
};

module.exports = {
  getSuppliers,
  getSupplierCount,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
const Supplier = require("../models/Supplier");

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ supplierName: 1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving suppliers", error: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const {
      supplierName,
      phone1,
      phone2,
      fax,
      email,
      address,
      paymentTerms,
      supplyProduct,
      date,
    } = req.body;

    let supplier = await Supplier.findOne({ supplierName });

    if (supplier) {
      supplier.supplyProducts.push({ product: supplyProduct, date });
      await supplier.save();
      return res.status(200).json({ message: "Product added to existing supplier", supplier });
    }

    const newSupplier = new Supplier({
      supplierName,
      phone1,
      phone2,
      fax,
      email,
      address,
      paymentTerms,
      supplyProducts: [{ product: supplyProduct, date }],
    });

    const saved = await newSupplier.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error creating supplier", error: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: "Error updating supplier", error: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting supplier", error: error.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: "Error getting supplier", error: error.message });
  }
};

const getSupplierCount = async (req, res) => {
  try {
    const count = await Supplier.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error getting supplier count", error: error.message });
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  getSupplierCount,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
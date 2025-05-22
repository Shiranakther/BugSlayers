const Purchase = require("../models/purchase");

// Create a new purchase
const createPurchase = async (req, res) => {
  try {
    const purchase = new Purchase({
      supplierName: req.body.supplierName,
      productName: req.body.productName,
      quantity: req.body.quantity,
      price: req.body.price,
      date: req.body.date,
    });

    const savedPurchase = await purchase.save();
    res.status(201).json(savedPurchase);
  } catch (error) {
    res.status(500).json({ message: "Error creating purchase", error: error.message });
  }
};

// Get all purchases
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving purchases", error: error.message });
  }
};

// Get a single purchase by ID
const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (purchase) {
      res.json(purchase);
    } else {
      res.status(404).json({ message: "Purchase not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving purchase", error: error.message });
  }
};

// Update a purchase
const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req
      .params.id,
      req.body,
      { new: true }
    );
    if (purchase) {
      res.json(purchase);
    } else {
      res.status(404).json({ message: "Purchase not found" });
    }
  }
  catch (error) {
    res.status(500).json({ message: "Error updating purchase", error: error.message });
  }
}

// Delete a purchase
const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (purchase) {
      res.json({ message: "Purchase deleted" });
    } else {
      res.status(404).json({ message: "Purchase not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting purchase", error: error.message });
  }
};

// Export the controller functions
module.exports = {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase
};


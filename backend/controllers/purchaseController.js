const Purchase = require("../models/purchase");

const createPurchase = async (req, res) => {
  try {
    const { quantity, price, discount = 0 } = req.body;
    const discountedPrice = price - (price * (discount / 100));
    const totalPrice = quantity * discountedPrice;

    const purchase = new Purchase({
      supplierName: req.body.supplierName,
      productName: req.body.productName,
      category: req.body.category,
      subcategory: req.body.subcategory,
      quantity,
      price,
      discount,
      totalPrice,
      date: req.body.date,
    });

    const savedPurchase = await purchase.save();
    res.status(201).json(savedPurchase);
  } catch (error) {
    res.status(500).json({ message: "Error creating purchase", error: error.message });
  }
};

const updatePurchase = async (req, res) => {
  try {
    const { quantity, price, discount = 0 } = req.body;
    const discountedPrice = price - (price * (discount / 100));
    const totalPrice = quantity * discountedPrice;

    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      {
        supplierName: req.body.supplierName,
        productName: req.body.productName,
        category: req.body.category,
        subcategory: req.body.subcategory,
        quantity,
        price,
        discount,
        totalPrice,
        date: req.body.date,
      },
      { new: true }
    );

    if (purchase) {
      res.json(purchase);
    } else {
      res.status(404).json({ message: "Purchase not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating purchase", error: error.message });
  }
};

module.exports = {
  createPurchase,
  getAllPurchases: async (req, res) => {
    try {
      const purchases = await Purchase.find();
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving purchases", error: error.message });
    }
  },
  getPurchaseById: async (req, res) => {
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
  },
  updatePurchase,
  deletePurchase: async (req, res) => {
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
  },
};

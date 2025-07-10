const Return = require("../models/Return");

exports.createReturn = async (req, res) => {
  try {
    const { returnId, productPrice, quantity } = req.body;
    if (!returnId) return res.status(400).json({ message: "Return ID is required" });

    const existing = await Return.findOne({ returnId });
    if (existing) return res.status(400).json({ message: "Return ID already exists" });

    const totalReturnPrice = Number(productPrice) * Number(quantity);

    const newReturn = new Return({
      ...req.body,
      productPrice: Number(productPrice),
      quantity: Number(quantity),
      totalReturnPrice,
    });

    const saved = await newReturn.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ message: "Failed to save return" });
  }
};

exports.updateReturn = async (req, res) => {
  try {
    const { productPrice, quantity } = req.body;
    const totalReturnPrice = Number(productPrice) * Number(quantity);

    const updated = await Return.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        productPrice: Number(productPrice),
        quantity: Number(quantity),
        totalReturnPrice,
      },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update return" });
  }
};

exports.getReturns = async (req, res) => {
  try {
    const returns = await Return.find();
    res.status(200).json(returns);
  } catch (err) {
    console.error("Get Returns Error:", err);
    res.status(500).json({ message: "Failed to fetch returns" });
  }
};

exports.deleteReturn = async (req, res) => {
  try {
    await Return.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Return deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete return" });
  }
};

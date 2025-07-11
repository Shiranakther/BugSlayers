const Return = require("../models/returnModel");
const Refund = require("../models/refundModel");

exports.getAllReturns = async (req, res) => {
  try {
    const returns = await Return.find().sort({ date: -1 });
    res.status(200).json(returns);
  } catch (err) {
    console.error("Get Returns Error:", err);
    res.status(500).json({ message: "Failed to fetch returns", error: err.message });
  }
};

exports.createReturn = async (req, res) => {
  try {
    const { returnId, companyName, date, product, quantity, productPrice, status, note } = req.body;

    if (!returnId || !companyName || !date || !product || !quantity || !productPrice || !status) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }
    if (isNaN(productPrice) || productPrice < 0) {
      return res.status(400).json({ message: "Product price cannot be negative" });
    }

    const existing = await Return.findOne({ returnId });
    if (existing) {
      return res.status(400).json({ message: "Return ID already exists" });
    }

    const totalReturnPrice = Number(productPrice) * Number(quantity);

    const newReturn = new Return({
      returnId,
      companyName,
      date,
      product,
      quantity: Number(quantity),
      productPrice: Number(productPrice),
      totalReturnPrice,
      status,
      note,
    });

    const saved = await newReturn.save();
    res.status(201).json({ message: "Return created successfully", return: saved });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ message: "Failed to save return", error: err.message });
  }
};

exports.updateReturn = async (req, res) => {
  try {
    const { returnId, companyName, date, product, quantity, productPrice, status, note } = req.body;

    if (!returnId || !companyName || !date || !product || !quantity || !productPrice || !status) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }
    if (isNaN(productPrice) || productPrice < 0) {
      return res.status(400).json({ message: "Product price cannot be negative" });
    }

    const existing = await Return.findOne({ returnId, _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(400).json({ message: "Return ID already exists" });
    }

    const totalReturnPrice = Number(productPrice) * Number(quantity);

    const updated = await Return.findByIdAndUpdate(
      req.params.id,
      {
        returnId,
        companyName,
        date,
        product,
        quantity: Number(quantity),
        productPrice: Number(productPrice),
        totalReturnPrice,
        status,
        note,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Return not found" });
    }

    res.status(200).json({ message: "Return updated successfully", return: updated });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Failed to update return", error: err.message });
  }
};

exports.deleteReturn = async (req, res) => {
  try {
    const returnDoc = await Return.findById(req.params.id);
    if (!returnDoc) {
      return res.status(404).json({ message: "Return not found" });
    }

    const refund = await Refund.findOne({ returnId: returnDoc.returnId });
    if (refund) {
      return res.status(400).json({ message: "Cannot delete return; it is referenced in a refund" });
    }

    await Return.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Return deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Failed to delete return", error: err.message });
  }
};
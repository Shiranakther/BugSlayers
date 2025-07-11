const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  productName: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Purchase", purchaseSchema);
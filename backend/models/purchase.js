const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Purchase", purchaseSchema);

const mongoose = require("mongoose");

const ReturnSchema = new mongoose.Schema(
  {
    returnId: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    date: { type: Date, required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    productPrice: { type: Number, required: true },
    totalReturnPrice: { type: Number, required: true },
    status: { type: String, required: true },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Return", ReturnSchema);

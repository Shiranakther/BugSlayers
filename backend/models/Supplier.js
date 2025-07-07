const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  supplierName: { type: String, required: true, unique: true },
  phone1: { type: String, required: true },
  phone2: String,
  fax: String,
  email: String,
  address: String,
  supplyProducts: [
    {
      product: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  paymentTerms: String,
});

module.exports = mongoose.model("Supplier", SupplierSchema);
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  purchaseId: { type: String, required: true, unique: true },
  supplierName: { type: String, required: true },
  productName: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  discountType: { type: String, enum: ['%', 'Rs'], default: '%' },
  totalPrice: { type: Number, required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);

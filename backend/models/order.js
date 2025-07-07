const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  companyName: { type: String, required: true }, // ✅ added
  quantity: { type: Number, required: true },
  discount: { type: Number, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Order', orderSchema);

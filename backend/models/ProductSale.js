const mongoose = require('mongoose');

const ProductSaleSchema = new mongoose.Schema({
  salesId: String,
  itemCode: String,
  itemName: String,
  price: Number,
  buyingPrice: Number,
  quantity: Number,
  discount: Number,
  total: Number,
  profit: Number,
  date: String
}, { timestamps: true });

module.exports = mongoose.model('ProductSale', ProductSaleSchema);

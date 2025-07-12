const Purchase = require('../models/purchase'); // Correct require path

const generatePurchaseId = async () => {
  const last = await Purchase.findOne({}).sort({ createdAt: -1 });
  let number = 0;
  if (last && last.purchaseId) {
    const match = last.purchaseId.match(/PUR-(\d+)/);
    if (match) number = parseInt(match[1], 10);
  }
  return `PUR-${(number + 1).toString().padStart(4, '0')}`;
};

const calculateTotalPrice = (qty, price, discount = 0, discountType = '%') => {
  const subtotal = qty * price;
  const discountAmt = discountType === '%' ? (subtotal * discount) / 100 : discount;
  return Math.max(0, subtotal - discountAmt);
};

exports.createPurchase = async (req, res) => {
  try {
    const purchaseId = await generatePurchaseId();
    const {
      supplierName,
      productName,
      category,
      subcategory,
      quantity,
      price,
      discount = 0,
      discountType = '%',
      date
    } = req.body;

    const totalPrice = calculateTotalPrice(quantity, price, discount, discountType);

    const newPurchase = new Purchase({
      purchaseId,
      supplierName,
      productName,
      category,
      subcategory,
      quantity,
      price,
      discount,
      discountType,
      totalPrice,
      date
    });

    const saved = await newPurchase.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
};

exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: 'Get failed', error: err.message });
  }
};

exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ message: 'Get by ID failed', error: err.message });
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    const {
      supplierName,
      productName,
      category,
      subcategory,
      quantity,
      price,
      discount = 0,
      discountType = '%',
      date
    } = req.body;

    const totalPrice = calculateTotalPrice(quantity, price, discount, discountType);

    const updated = await Purchase.findByIdAndUpdate(
      req.params.id,
      { supplierName, productName, category, subcategory, quantity, price, discount, discountType, totalPrice, date },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Purchase not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Purchase not found' });
    res.json({ message: 'Purchase deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

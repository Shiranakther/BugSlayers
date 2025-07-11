const Order = require("../models/Order");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};


exports.createOrder = async (req, res) => {
  try {
    const { orderId, companyName, quantity, discount, date } = req.body;

    if (!orderId || !companyName || !quantity || !discount || !date) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    const existingOrder = await Order.findOne({ orderId });
    if (existingOrder) {
      return res.status(400).json({ error: 'Order ID already exists' });
    }

    const order = new Order({ orderId, companyName, quantity, discount, date });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create order", details: err.message });
  }
};


exports.updateOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const removed = await Order.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
};

exports.getOrderReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const orders = await Order.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Report fetch failed", details: err.message });
  }
};


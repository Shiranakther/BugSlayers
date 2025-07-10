const Order = require("../models/Order");

// Get all orders sorted by date descending
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders", details: err.message });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { orderId, companyName, quantity, discount, date } = req.body;

    if (!orderId || !companyName || !quantity || !discount || !date) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    const existingOrder = await Order.findOne({ orderId });
    if (existingOrder) {
      return res.status(400).json({ error: "Order ID already exists" });
    }

    const order = new Order({ orderId, companyName, quantity, discount, date });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
};

// Update an existing order by ID
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

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const removed = await Order.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
};

// Get orders report between two dates (startDate and endDate as query params)
exports.getOrderReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate query parameters are required" });
    }

    const orders = await Order.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Report fetch failed", details: err.message });
  }
};

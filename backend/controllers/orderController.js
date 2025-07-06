const Order = require('../models/orderModel');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { orderId, quantity, discount, date } = req.body;
    const order = new Order({ orderId, quantity, discount, date });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderId, quantity, discount, date } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderId, quantity, discount, date },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting order' });
  }
};

// Get orders by date range (optional)
exports.getOrdersByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const orders = await Order.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

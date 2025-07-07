const Order = require('../models/orderModel');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { orderId, companyName, quantity, discount, date } = req.body;
    if (!orderId || !companyName || !quantity || !discount || !date) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }
    const order = new Order({ orderId, companyName, quantity, discount, date });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { orderId, companyName, quantity, discount, date } = req.body;
    if (!orderId || !companyName || !quantity || !discount || !date) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderId, companyName, quantity, discount, date },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order', details: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

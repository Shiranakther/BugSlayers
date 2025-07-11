const Order = require("../models/Order");

// @desc Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// @desc Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      orderId,
      companyName,
      productName,
      category,
      subcategory,
      quantity,
      date,
      status
    } = req.body;

    // Validation
    if (
      !orderId ||
      !companyName ||
      !productName ||
      !category ||
      !subcategory ||
      !quantity ||
      !date ||
      !status
    ) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    // Check for duplicate Order ID
    const existingOrder = await Order.findOne({ orderId });
    if (existingOrder) {
      return res.status(400).json({ error: "Order ID already exists" });
    }

    const order = new Order({
      orderId,
      companyName,
      productName,
      category,
      subcategory,
      quantity,
      date,
      status
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create order", details: err.message });
  }
};

// @desc Update an existing order
exports.updateOrder = async (req, res) => {
  try {
    const {
      orderId,
      companyName,
      productName,
      category,
      subcategory,
      quantity,
      date,
      status
    } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderId,
        companyName,
        productName,
        category,
        subcategory,
        quantity,
        date,
        status
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// @desc Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
};

// @desc Get orders by date range for report
exports.getOrderReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
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

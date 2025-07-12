const Order = require("../models/Order");

// Get all orders, with populated category and subcategory names
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("category", "categoryName")
      .populate("subcategory", "subcategoryName")
      .sort({ date: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Create a new order
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
      status,
    } = req.body;

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
      status,
    });

    await order.save();
    // Populate category and subcategory before sending response
    await order.populate("category", "categoryName");
    await order.populate("subcategory", "subcategoryName");

    res.status(201).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create order", details: err.message });
  }
};

// Update an existing order by ID
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
      status,
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
        status,
      },
      { new: true, runValidators: true }
    )
      .populate("category", "categoryName")
      .populate("subcategory", "subcategoryName");

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// Delete order by ID
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

// Get orders filtered by date range for report, with populated category & subcategory
exports.getOrderReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const orders = await Order.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate("category", "categoryName")
      .populate("subcategory", "subcategoryName")
      .sort({ date: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Report fetch failed", details: err.message });
  }
};

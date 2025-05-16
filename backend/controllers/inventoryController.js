const InventoryItem = require('../models/InventoryItem');
const multer = require('multer');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory for storing images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`); // Unique filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
});

// Helper function to generate a unique numeric code
const generateItemCode = async () => {
  // Get all existing items
  const existingItems = await InventoryItem.find();

  // Get the highest numeric code among existing items
  let maxCode = 0;
  existingItems.forEach(item => {
  if (item.code) { // Check if item.code is defined
    const match = item.code.match(/^\d+$/); // Match only numeric codes
    if (match) {
      const number = parseInt(item.code);
      if (number > maxCode) {
        maxCode = number;
      }
    }
  }
  });


  // Generate the next sequential code
  const nextCode = maxCode + 1;

  // Ensure the code is 3 digits (e.g., "001", "002")
  return String(nextCode).padStart(3, '0');
};

// Get all inventory items
const getInventoryItems = async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching inventory items' });
  }
};

// Add a new inventory item
const addInventoryItem = async (req, res) => {
  try {
    const { productName, category, quantity, buyingPrice, sellingPrice, dateAdded } = req.body;
    const image = req.file ? req.file.filename : null;  // Check if the image is correctly attached

    // Validate inputs
    if (!productName || !category || !quantity || !buyingPrice || !sellingPrice || !dateAdded) {
      return res.status(400).json({ error: 'All fields are required!' });
    }
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number!' });
    }
    if (isNaN(buyingPrice) || buyingPrice <= 0 || isNaN(sellingPrice) || sellingPrice <= 0) {
      return res.status(400).json({ error: 'Prices must be positive numbers!' });
    }
    if (!Date.parse(dateAdded)) {
      return res.status(400).json({ error: 'Invalid date format!' });
    }

    // Check if the product already exists
    const existingItem = await InventoryItem.findOne({ productName, category });
    if (existingItem) {
      return res.status(409).json({
        error: 'Product already exists!',
        message: 'You cannot add this product again as it already exists. Consider updating its details.',
        code: existingItem.code,
        item: existingItem,
      });
    }

    // Generate a new numeric code for the product
    const code = await generateItemCode();

    // Create a new item
    const newItem = new InventoryItem({
      code,
      productName,
      category,
      quantity: parseInt(quantity),
      buyingPrice: parseFloat(buyingPrice).toFixed(2),
      sellingPrice: parseFloat(sellingPrice).toFixed(2),
      dateAdded,
      image,
    });

    const savedItem = await newItem.save();
    return res.status(201).json({
      message: 'New item added successfully!',
      code: savedItem.code,
      item: savedItem,
    });
  } catch (err) {
    console.error('Error adding item: ' + err.message);
    res.status(500).json({ error: `Failed to add item: ${err.message}` });
  }
};


// Get inventory count
const getInventoryCount = async (req, res) => {
  try {
    const count = await InventoryItem.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an inventory item
const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  const { productName, category, quantity, buyingPrice, sellingPrice, dateAdded } = req.body;

  const updateData = {
    productName,
    category,
    quantity,
    buyingPrice,
    sellingPrice,
    dateAdded,
  };

  if (req.file) {
    updateData.image = req.file.filename;
  }

  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    res.json(updatedItem);
  } catch (error) {
    console.error(`Error updating item: ${error.message}`);
    res.status(500).json({ error: `Failed to update item: ${error.message}` });
  }
};

// Delete an inventory item
const deleteInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    await InventoryItem.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully!' });
  } catch (error) {
    console.error(`Error deleting item: ${error.message}`);
    res.status(500).json({ error: `Failed to delete item: ${error.message}` });
  }
};

module.exports = {
  getInventoryItems,
  addInventoryItem,
  getInventoryCount,
  updateInventoryItem,
  deleteInventoryItem,
  upload,
};

const Customer = require('../models/customerModel'); // Ensure this model exists

// Fetch all customers
// Fetch customers (with optional filtering by name)
// Fetch customers (with optional filtering by name)
const getCustomers = async (req, res) => {
    try {
      const { name } = req.query;
      let query = {};
      
      if (name) {
        query = { name }; // Search by name if provided
      }
  
      const customers = await Customer.find(query);
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customers', error });
    }
  };

// Create a new customer
const createCustomer = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate request body
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check if customer name already exists
    const existingCustomer = await Customer.findOne({ name: name.trim() });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this name already exists' });
    }

    // Add the new customer if not existing
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error creating customer:', error); // Log the error for debugging
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', error: error.message });
    } else {
      res.status(500).json({ message: 'Error creating customer', error });
    }
  }
};
  

// Update an existing customer
const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error });
  }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
};


const getCustomerByName = async (req, res) => {
  try {
    const { name } = req.params;  // This should be from req.params for the route `/name/:name`
    const customer = await Customer.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer by name', error });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerByName,
 
  // ✅ Ensure this is exported
};










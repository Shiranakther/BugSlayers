const express = require('express');
const router = express.Router();



const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerByName
 
} = require('../controllers/customerController');

// Define backend routes
router.get('/', getCustomers); // Fetch all customers
router.post('/', createCustomer); // Create a new customer
router.put('/:id', updateCustomer); // Update an existing customer
router.delete('/:id', deleteCustomer); // Delete a customer
router.get('/name/:name',getCustomerByName); 


module.exports = router;

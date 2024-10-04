const express = require('express');
const router = express.Router();
const { getCustomers, getCustomerDetails, deleteCustomer } = require('../controller/adminCustomersController');
const verifyAdmin = require('../middleware/adminAuth'); 

// Get all customers (admin access only)
router.get('/admin/customers', verifyAdmin, getCustomers);

// Get customer details by ID (admin access only)
router.get('/admin/customers/:id', verifyAdmin, getCustomerDetails);

// Delete customer by ID (admin access only)
router.delete('/admin/customers/:id', verifyAdmin, deleteCustomer);

module.exports = router;

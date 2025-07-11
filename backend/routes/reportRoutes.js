const express = require('express');
const router = express.Router();
const { getSalesReport } = require('../controllers/reportController'); // adjust path if needed

router.get('/sales-report', getSalesReport);

module.exports = router;



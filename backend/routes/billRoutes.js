const express = require('express');
const router = express.Router();
const { getItemByCode } = require('../controllers/billController');

// Fetch item using code
router.get('/inventoryitems/:code', getItemByCode);

module.exports = router;

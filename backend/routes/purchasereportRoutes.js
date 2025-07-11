const express = require('express');
const router = express.Router();
const Purchase = require('../models/purchase');

router.get('/purchase-report', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const report = await Purchase.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: '$productName',
          totalQuantity: { $sum: '$quantity' },
          totalSpent: { $sum: '$totalPrice' },
          avgDiscount: { $avg: '$discount' },
        }
      }
    ]);

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating purchase report', error });
  }
});

module.exports = router;

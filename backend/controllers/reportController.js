const Invoice = require('../models/invoice'); // adjust the path if different

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const invoices = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.itemName',
          totalQuantity: { $sum: '$items.quantity' },
          totalSales: {
            $sum: {
              $multiply: [
                '$items.quantity',
                { $toDouble: '$items.itemPrice' }
              ]
            }
          }
        }
      }
    ]);

    res.json(invoices);
  } catch (err) {
    console.error('Error generating sales report:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

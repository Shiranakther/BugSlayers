const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ✅ Serve static files (e.g., uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Route imports
const supplierRoutes = require('./routes/supplierRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategory');
const reportRoutes = require('./routes/reportRoutes');
const salesRoutes = require('./routes/salesRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const purchaseRoutes = require('./routes/purchasesRoutes');
const purchasereportRoutes = require('./routes/purchasereportRoutes');
const billRoutes = require('./routes/billRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const productSalesRoutes = require('./routes/productSales'); // ✅ Order routes

// ✅ API route usage
app.use('/api/suppliers', supplierRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/purchase-report', purchasereportRoutes);
app.use('/api/bill', billRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/productsales', productSalesRoutes);

 // ✅ Using OrderRoutes with correct casing

// ✅ MongoDB connection
mongoose.connect('mongodb://localhost:27017/mern-vite-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const supplierRoutes = require('./routes/supplierRoutes'); // ✅
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const purchaseRoutes = require("./routes/purchaseRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect('mongodb://localhost:27017/bugslayers', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
}).catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Use routes
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/purchase", purchaseRoutes);

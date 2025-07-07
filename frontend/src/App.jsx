import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Authentication
import Login from "./components/Login";
import Signup from "./components/Signup";

// Layout & Dashboard
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";

// Supplier Management
import AddSupplier from "./components/AddSupplier";
import ManageSuppliers from "./components/ManageSuppliers";
import EditSupplier from "./components/EditSupplier";

// Inventory
import AddInventoryItem from "./components/AddInventoryItem";
import ManageInventories from "./components/ManageInventories";

// Customer Management
import AddCustomer from "./components/AddCustomer";
import ManageCustomer from "./components/ManageCustomer";

// Category Management
import AddCategory from "./components/AddCategory";
import ManageCategories from "./components/ManageCategory";

// Billing & Sales
import Bill from "./components/Bill";
import AddSalesRecord from "./components/AddSalesRecord";
import ManageSales from "./components/ManageSales";

// Catalog
import Catalog from "./components/Catalog";

// Reports
import LowStockReport from './components/LowStockReport';
import InventorySummary from './components/InventorySummary';
import SalesReport from "./components/SalesReport";
import PurchaseReport from "./components/PurchaseReports";

// Purchases
import AddPurchase from "./components/AddPurchase";
import ManagePurchase from "./components/ManagePurchase";

// Orders
import ManageOrders from "./components/ManageOrders";
import OrderReport from "./components/OrderReport";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />

          {/* Supplier Routes */}
          <Route path="suppliers/add" element={<AddSupplier />} />
          <Route path="/dashboard/suppliers/manage" element={<ManageSuppliers />} />
        <Route path="/dashboard/suppliers/edit/:id" element={<EditSupplier />} />
        
          {/* Inventory Routes */}
          <Route path="inventory/add" element={<AddInventoryItem />} />
          <Route path="inventory/add1" element={<ManageInventories />} />

          {/* Customer Routes */}
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="customers/manage" element={<ManageCustomer />} />

          {/* Category Routes */}
          <Route path="category/add" element={<AddCategory />} />
          <Route path="category/add1" element={<ManageCategories />} />

          {/* Billing & Sales */}
          <Route path="bill" element={<Bill />} />
          <Route path="sales/add" element={<AddSalesRecord />} />
          <Route path="sales/manage" element={<ManageSales />} />

          {/* Catalog */}
          <Route path="catalog/view" element={<Catalog />} />

          {/* Reports */}
          <Route path="inventory/reports/low-stock" element={<LowStockReport />} />
          <Route path="inventory/reports/summary" element={<InventorySummary />} />
          <Route path="sales/report" element={<SalesReport />} />
          <Route path="purchases/report" element={<PurchaseReport />} />

          {/* Purchases */}
          <Route path="purchases/add" element={<AddPurchase />} />
          <Route path="purchases/manage" element={<ManagePurchase />} />

          {/* Orders */}
          <Route path="orders/manage" element={<ManageOrders />} />
          <Route path="orders/report" element={<OrderReport />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

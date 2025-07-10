import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Auth
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";

// Layout & Dashboard
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";

// Suppliers
import AddSupplier from "./components/AddSupplier";
import ManageSuppliers from "./components/ManageSuppliers";
import EditSupplier from "./components/EditSupplier";

// Inventory
import AddInventoryItem from "./components/AddInventoryItem";
import ManageInventories from "./components/ManageInventories";

// Customers
import AddCustomer from "./components/AddCustomer";
import ManageCustomer from "./components/ManageCustomer";

// Categories
import AddCategory from "./components/AddCategory";
import AddSubcategory from "./components/AddSubcategory";
import ManageCategories from "./components/ManageCategory";

// Sales
import AddSalesRecord from "./components/AddSalesRecord";
import ManageSales from "./components/ManageSales";
import SalesReport from "./components/SalesReport";

// Catalog & Bill
import Catalog from "./components/Catalog";
import Bill from "./components/Bill";

// Inventory Reports
import LowStockReport from "./components/LowStockReport";
import InventorySummary from "./components/InventorySummary";

// Purchases
import AddPurchase from "./components/AddPurchase";
import ManagePurchase from "./components/ManagePurchase";
import PurchaseReport from "./components/PurchaseReports";

// Orders
import AddOrder from "./components/AddOrder";
import ManageOrders from "./components/ManageOrders";
import OrderReport from "./components/OrderReport";

// Invoices
import SaveInvoice from "./components/SaveInvoice";

// Returns (Add + Manage Combined)
import ManageReturn from "./components/ManageReturn";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes inside Dashboard Layout */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />

          {/* Suppliers */}
          <Route path="suppliers/add" element={<AddSupplier />} />
          <Route path="suppliers/manage" element={<ManageSuppliers />} />
          <Route path="suppliers/edit/:id" element={<EditSupplier />} />

          {/* Inventory */}
          <Route path="inventory/add" element={<AddInventoryItem />} />
          <Route path="inventory/add1" element={<ManageInventories />} />

          {/* Customers */}
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="customers/manage" element={<ManageCustomer />} />

          {/* Categories */}
          <Route path="category/add" element={<AddCategory />} />
          <Route path="subcategory/add" element={<AddSubcategory />} />
          <Route path="category/add1" element={<ManageCategories />} />

          {/* Sales */}
          <Route path="sales/add" element={<AddSalesRecord />} />
          <Route path="sales/manage" element={<ManageSales />} />
          <Route path="sales/report" element={<SalesReport />} />

          {/* Catalog & Bill */}
          <Route path="catalog/view" element={<Catalog />} />
          <Route path="bill" element={<Bill />} />

          {/* Inventory Reports */}
          <Route path="inventory/reports/low-stock" element={<LowStockReport />} />
          <Route path="inventory/reports/summary" element={<InventorySummary />} />

          {/* Purchases */}
          <Route path="purchases/add" element={<AddPurchase />} />
          <Route path="purchases/manage" element={<ManagePurchase />} />
          <Route path="purchases/report" element={<PurchaseReport />} />

          {/* Orders */}
          <Route path="orders/add" element={<AddOrder />} />
          <Route path="orders/manage" element={<ManageOrders />} />
          <Route path="orders/report" element={<OrderReport />} />

          {/* Invoices */}
          <Route path="invoices" element={<SaveInvoice />} />

          {/* ✅ Returns (Combined Add + Manage) */}
          <Route path="returns/manage" element={<ManageReturn />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

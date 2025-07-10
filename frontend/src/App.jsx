import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import "./App.css";
import AddSupplier from "./components/AddSupplier";
import ManageSuppliers from "./components/ManageSuppliers";
import EditSupplier from "./components/EditSupplier";
import AddInventoryItem from "./components/AddInventoryItem";
import ManageInventories from "./components/ManageInventories";
import AddCustomer from "./components/AddCustomer";
import ManageCustomer from "./components/ManageCustomer";
import AddCategory from "./components/AddCategory";
import AddSubcategory from "./components/AddSubcategory";
import ManageCategories from "./components/ManageCategory";
import Bill from "./components/Bill";
import AddSalesRecord from "./components/AddSalesRecord";
import ManageSales from "./components/ManageSales";
import Catalog from "./components/Catalog";
import LowStockReport from './components/LowStockReport';
import InventorySummary from './components/InventorySummary';
import SalesReport from "./components/SalesReport";
import AddPurchase from "./components/AddPurchase";
import ManagePurchase from "./components/ManagePurchase"; 
import PurchaseReport from "./components/PurchaseReports";
import SaveInvoice from './components/SaveInvoice';
import ForgotPassword from './components/ForgotPassword'; // ✅ Import here

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ✅ Protected Routes under Layout */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="suppliers/add" element={<AddSupplier />} />
          <Route path="suppliers/manage" element={<ManageSuppliers />} />
          <Route path="suppliers/edit/:id" element={<EditSupplier />} />
          <Route path="inventory/add" element={<AddInventoryItem />} />
          <Route path="inventory/add1" element={<ManageInventories />} />
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="customers/manage" element={<ManageCustomer />} />
          <Route path="category/add" element={<AddCategory />} />
          <Route path="subcategory/add" element={<AddSubcategory />} />
          <Route path="category/add1" element={<ManageCategories />} />
          <Route path="bill" element={<Bill />} />
          <Route path="sales/add" element={<AddSalesRecord />} />
          <Route path="sales/manage" element={<ManageSales />} />
          <Route path="catalog/view" element={<Catalog />} />
          <Route path="inventory/reports/low-stock" element={<LowStockReport />} />
          <Route path="inventory/reports/summary" element={<InventorySummary />} />
          <Route path="sales/report" element={<SalesReport />} />
          <Route path="purchases/add" element={<AddPurchase />} />
          <Route path="purchases/manage" element={<ManagePurchase />} />
          <Route path="purchases/report" element={<PurchaseReport />} />
          <Route path="invoices" element={<SaveInvoice />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

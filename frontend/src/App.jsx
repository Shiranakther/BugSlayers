import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login"; // Ensure the path is correct
import Signup from "./components/Signup"; // Ensure the path is correct
import Dashboard from "./components/Dashboard"; // Ensure the path is correct
import Layout from "./components/Layout"; // Ensure the path is correct
import "./App.css";
import AddSupplier from "./components/AddSupplier"; // Ensure the path is correct
import ManageSuppliers from "./components/ManageSuppliers"; // Ensure the path is correct
import EditSupplier from "./components/EditSupplier"; // Ensure the path is correct
import AddInventoryItem from "./components/AddInventoryItem"; // Ensure the path is correct
import ManageInventories from "./components/ManageInventories"; // Ensure the path is correct
import AddCustomer from "./components/AddCustomer";
import ManageCustomer from "./components/ManageCustomer"; // Ensure the path is correct
import AddCategory from "./components/AddCategory";
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


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Layout />}>
          {/* Nested routes under /dashboard */}
          <Route index element={<Dashboard />} />{" "}
          {/* Default route for /dashboard */}
          <Route path="suppliers/add" element={<AddSupplier />} />
          <Route path="suppliers/manage" element={<ManageSuppliers />} />
          <Route path="suppliers/edit/:id" element={<EditSupplier />} />
          <Route path="inventory/add" element={<AddInventoryItem />} />
          <Route path="inventory/add1" element={<ManageInventories />} />
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="customers/manage" element={<ManageCustomer />} />
          <Route path="category/add" element={<AddCategory />} />
          <Route path="category/add1" element={<ManageCategories />} />
          <Route path="/dashboard/bill" element={<Bill />} />
          <Route path="sales/add" element={<AddSalesRecord />} />
          <Route path="sales/manage" element={<ManageSales />} />
          <Route path="catalog/view" element={<Catalog />} />

          <Route path="inventory/reports/low-stock" element={<LowStockReport />} />
          <Route path="inventory/reports/summary" element={<InventorySummary />} />
      

          <Route path="sales/report" element={<SalesReport />} />
          <Route path="purchases/add" element={<AddPurchase />} />
          <Route path="purchases/manage" element={<ManagePurchase />} />
          <Route path="purchases/report" element={<PurchaseReport />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;

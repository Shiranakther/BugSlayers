import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import "./OrderReport.css";

const OrderReport = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    fetchCategoriesAndSubcategories();
  }, []);

  const fetchCategoriesAndSubcategories = async () => {
    try {
      const [categoriesRes, subcategoriesRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/category`),
        axios.get(`${BASE_URL}/api/subcategories`),
      ]);
      setCategories(categoriesRes.data);
      setSubcategories(subcategoriesRes.data);
    } catch (error) {
      console.error("Error fetching categories/subcategories:", error);
    }
  };

  // Helpers to get names from IDs, fallback to 'N/A' if not found
  const getCategoryName = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.categoryName : "N/A";
  };

  const getSubcategoryName = (id) => {
    const sub = subcategories.find((s) => s._id === id);
    return sub ? sub.subcategoryName : "N/A";
  };

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/api/orders/report`, {
        params: { startDate, endDate },
      });
      setOrders(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch report.");
      setOrders([]);
      console.error(err);
    }
  };

  const generatePDF = () => {
    if (orders.length === 0) {
      alert("No data to generate report.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Order Report", 20, 15);
    doc.setFontSize(11);
    doc.text(`From: ${startDate} To: ${endDate}`, 20, 25);

    const tableColumn = [
      "#",
      "Order ID",
      "Supplier",
      "Product",
      "Category",
      "Subcategory",
      "Quantity",
      "Date",
      "Status",
    ];

    const tableRows = orders.map((order, index) => [
      index + 1,
      order.orderId,
      order.companyName,
      order.productName,
      getCategoryName(order.category),
      getSubcategoryName(order.subcategory),
      order.quantity,
      new Date(order.date).toLocaleDateString(),
      order.status,
    ]);

    autoTable(doc, {
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("order_report.pdf");
  };

  const clearReport = () => {
    setStartDate("");
    setEndDate("");
    setOrders([]);
    setError(null);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Order Report</h2>
        <button className="btn-back" onClick={() => navigate("/dashboard/orders/manage")}>
          ⬅ Back to Manage Orders
        </button>
      </div>

      <div className="row mb-3 align-items-end">
        <div className="col-md-3">
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {orders.length === 0 && !error && <p className="no-data-message">No report data to display.</p>}

      <div className="report-buttons mb-3">
        <button className="btn btn-primary" onClick={fetchReport}>
          View Report
        </button>
        <button className="btn btn-success" onClick={generatePDF} disabled={orders.length === 0}>
          Download Report
        </button>
        <button className="btn btn-warning" onClick={clearReport}>
          Clear
        </button>
      </div>

      {orders.length > 0 && (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Supplier</th>
              <th>Product</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{order.orderId}</td>
                <td>{order.companyName}</td>
                <td>{order.productName}</td>
                <td>{getCategoryName(order.category)}</td>
                <td>{getSubcategoryName(order.subcategory)}</td>
                <td>{order.quantity}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderReport;
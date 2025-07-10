import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import './OrderReport.css';

const OrderReport = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/api/orders/report`, {
        params: { startDate, endDate },
      });
      setOrders(res.data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to fetch report. Please check server and date formats.'
      );
      setOrders([]);
    }
  };

  const generatePDF = () => {
    if (orders.length === 0) {
      alert('No data to generate report.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Order Report', 20, 15);
    doc.setFontSize(11);
    doc.text(`From: ${startDate} To: ${endDate}`, 20, 25);

    const colWidth = [10, 40, 30, 30, 40];
    let y = 35;

    const headers = ['#', 'Order ID', 'Quantity', 'Discount (%)', 'Date'];
    let x = 20;
    headers.forEach((header, i) => {
      doc.text(header, x, y);
      x += colWidth[i];
    });
    y += 8;

    orders.forEach((order, index) => {
      let x = 20;
      const row = [
        (index + 1).toString(),
        order.orderId,
        order.quantity.toString(),
        order.discount.toString(),
        new Date(order.date).toLocaleDateString(),
      ];
      row.forEach((text, i) => {
        doc.text(text, x, y);
        x += colWidth[i];
      });
      y += 8;
    });

    doc.save('order_report.pdf');
  };

  const clearReport = () => {
    setStartDate('');
    setEndDate('');
    setOrders([]);
    setError(null);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Order Report</h2>
        <button
  className="btn-back"
  onClick={() => navigate('/dashboard/orders/manage')}
>
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

      {orders.length === 0 && !error && (
        <p className="no-data-message">No report data to display.</p>
      )}

      <div className="report-buttons">
        <button className="btn btn-primary" onClick={fetchReport}>
          View Report
        </button>
        <button
          className="btn btn-success"
          onClick={generatePDF}
          disabled={orders.length === 0}
        >
          Download Report
        </button>
        <button
          className="btn btn-warning"
          onClick={clearReport}
          disabled={orders.length === 0 && !startDate && !endDate}
        >
          Clear
        </button>
      </div>

      {orders.length > 0 && (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Quantity</th>
              <th>Discount (%)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{order.orderId}</td>
                <td>{order.quantity}</td>
                <td>{order.discount}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderReport;

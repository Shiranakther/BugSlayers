import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManageOrders.css';

const ManageOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newOrder, setNewOrder] = useState({
    orderId: '',
    companyName: '',
    quantity: '',
    discount: '',
    date: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editedOrder, setEditedOrder] = useState({
    orderId: '',
    companyName: '',
    quantity: '',
    discount: '',
    date: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders`);
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/suppliers`);
      setSuppliers(res.data);
    } catch (err) {
      console.error('Failed to fetch suppliers', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrder = async () => {
    const { orderId, companyName, quantity, discount, date } = newOrder;
    if (!orderId || !companyName || !quantity || !discount || !date) {
      setError('Please fill all fields');
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/orders`, {
        orderId,
        companyName,
        quantity: Number(quantity),
        discount: Number(discount),
        date
      });
      setOrders([res.data, ...orders]);
      setNewOrder({ orderId: '', companyName: '', quantity: '', discount: '', date: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add order');
    }
  };

  const handleEditClick = (order) => {
    setEditingId(order._id);
    setEditedOrder({
      orderId: order.orderId,
      companyName: order.companyName,
      quantity: order.quantity,
      discount: order.discount,
      date: new Date(order.date).toISOString().split('T')[0]
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (id) => {
    const { orderId, companyName, quantity, discount, date } = editedOrder;
    if (!orderId || !companyName || !quantity || !discount || !date) {
      setError('Please fill all fields');
      return;
    }

    try {
      const res = await axios.put(`${BASE_URL}/api/orders/${id}`, {
        orderId,
        companyName,
        quantity: Number(quantity),
        discount: Number(discount),
        date
      });
      setOrders((prev) => prev.map((order) => (order._id === id ? res.data : order)));
      setEditingId(null);
      setEditedOrder({ orderId: '', companyName: '', quantity: '', discount: '', date: '' });
      setError(null);
    } catch (err) {
      setError('Failed to update order');
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      setError('Failed to delete order');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedOrder({ orderId: '', companyName: '', quantity: '', discount: '', date: '' });
  };

  const goToReportPage = () => {
    navigate('/dashboard/orders/report');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Manage Orders</h2>
        <button className="btn btn-success" onClick={goToReportPage}>
          Generate Report
        </button>
      </div>

      <table className="table table-bordered table-gray mb-4">
        <thead className="table-light">
          <tr>
            <th>Order ID</th>
            <th>Company Name</th>
            <th>Quantity</th>
            <th>Discount (%)</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" name="orderId" className="form-control" value={newOrder.orderId} onChange={handleInputChange} /></td>
            <td>
              <select name="companyName" className="form-control" value={newOrder.companyName} onChange={handleInputChange}>
                <option value="">-- Select Supplier --</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier.supplierName}>
                    {supplier.supplierName}
                  </option>
                ))}
              </select>
            </td>
            <td><input type="number" name="quantity" className="form-control" value={newOrder.quantity} onChange={handleInputChange} /></td>
            <td><input type="number" name="discount" className="form-control" value={newOrder.discount} onChange={handleInputChange} /></td>
            <td><input type="date" name="date" className="form-control" value={newOrder.date} onChange={handleInputChange} /></td>
            <td><button className="btn btn-success btn-sm" onClick={handleAddOrder}>Add</button></td>
          </tr>
        </tbody>
      </table>

      {error && <p className="text-danger">{error}</p>}

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="table table-striped table-gray">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Company Name</th>
              <th>Quantity</th>
              <th>Discount (%)</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) =>
              editingId === order._id ? (
                <tr key={order._id}>
                  <td><input type="text" name="orderId" className="form-control" value={editedOrder.orderId} onChange={handleEditChange} /></td>
                  <td>
                    <select name="companyName" className="form-control" value={editedOrder.companyName} onChange={handleEditChange}>
                      <option value="">-- Select Supplier --</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier._id} value={supplier.supplierName}>
                          {supplier.supplierName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td><input type="number" name="quantity" className="form-control" value={editedOrder.quantity} onChange={handleEditChange} /></td>
                  <td><input type="number" name="discount" className="form-control" value={editedOrder.discount} onChange={handleEditChange} /></td>
                  <td><input type="date" name="date" className="form-control" value={editedOrder.date} onChange={handleEditChange} /></td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => handleSaveEdit(order._id)}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={order._id}>
                  <td>{order.orderId}</td>
                  <td>{order.companyName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.discount}</td>
                  <td>{new Date(order.date).toISOString().split('T')[0]}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(order)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteOrder(order._id)}>Delete</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageOrders;

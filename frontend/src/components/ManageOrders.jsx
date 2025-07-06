import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManageOrders.css';

const ManageOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ orderId: '', quantity: '', discount: '', date: '' });
  const [editingId, setEditingId] = useState(null);
  const [editedOrder, setEditedOrder] = useState({ orderId: '', quantity: '', discount: '', date: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrder = async () => {
    const { orderId, quantity, discount, date } = newOrder;
    if (!orderId || !quantity || !discount || !date) {
      setError('Please fill all fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/orders', {
        orderId,
        quantity: Number(quantity),
        discount: Number(discount),
        date,
      });
      setOrders([res.data, ...orders]);
      setNewOrder({ orderId: '', quantity: '', discount: '', date: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add order');
    }
  };

  const handleEditClick = (order) => {
    setEditingId(order._id);
    setEditedOrder({
      orderId: order.orderId,
      quantity: order.quantity,
      discount: order.discount,
      date: new Date(order.date).toISOString().split('T')[0],
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (id) => {
    const { orderId, quantity, discount, date } = editedOrder;
    if (!orderId || !quantity || !discount || !date) {
      setError('Please fill all fields');
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/orders/${id}`, {
        orderId,
        quantity: Number(quantity),
        discount: Number(discount),
        date,
      });
      setOrders((prev) => prev.map((order) => (order._id === id ? res.data : order)));
      setEditingId(null);
      setEditedOrder({ orderId: '', quantity: '', discount: '', date: '' });
      setError(null);
    } catch (err) {
      setError('Failed to update order');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedOrder({ orderId: '', quantity: '', discount: '', date: '' });
    setError(null);
  };

  // New: Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete order');
    }
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

      <table className="table table-bordered mb-4">
        <thead className="table-light">
          <tr>
            <th>Order ID</th>
            <th>Quantity</th>
            <th>Discount (%)</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                name="orderId"
                className="form-control"
                value={newOrder.orderId}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="number"
                name="quantity"
                className="form-control"
                value={newOrder.quantity}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="number"
                name="discount"
                className="form-control"
                value={newOrder.discount}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="date"
                name="date"
                className="form-control"
                value={newOrder.date}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <button className="btn btn-success" onClick={handleAddOrder}>
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {error && <p className="text-danger">{error}</p>}

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Quantity</th>
              <th>Discount (%)</th>
              <th>Date</th>
              <th>Actions</th> {/* Changed label to plural for clarity */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) =>
              editingId === order._id ? (
                <tr key={order._id}>
                  <td>
                    <input
                      type="text"
                      name="orderId"
                      className="form-control"
                      value={editedOrder.orderId}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="quantity"
                      className="form-control"
                      value={editedOrder.quantity}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="discount"
                      className="form-control"
                      value={editedOrder.discount}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={editedOrder.date}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-edit btn-sm me-2"
                      onClick={() => handleSaveEdit(order._id)}
                    >
                      Save
                    </button>
                    <button className="btn btn-cancel btn-sm" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={order._id}>
                  <td>{order.orderId}</td>
                  <td>{order.quantity}</td>
                  <td>{order.discount}</td>
                  <td>{new Date(order.date).toISOString().split('T')[0]}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(order)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(order._id)}>
                      Delete
                    </button>
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

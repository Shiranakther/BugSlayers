import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faTimes,
  faSave,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./ManageOrders.css";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    orderId: "",
    companyName: "",
    quantity: "",
    discount: "",
    date: "",
  });

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders`);
      setOrders(res.data);
      setError("");
    } catch {
      setError("Error fetching orders");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/orders/${id}`);
      setOrders(orders.filter((o) => o._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const handleEdit = (order) => {
    setEditId(order._id);
    setEditForm({
      orderId: order.orderId,
      companyName: order.companyName,
      quantity: order.quantity,
      discount: order.discount,
      date: order.date ? order.date.slice(0, 10) : "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/api/orders/${editId}`, {
        ...editForm,
        quantity: Number(editForm.quantity),
        discount: Number(editForm.discount),
      });
      setEditId(null);
      fetchOrders();
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Manage Orders</h2>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Supplier</th>
                  <th>Quantity</th>
                  <th>Discount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) =>
                  editId === order._id ? (
                    <tr key={order._id}>
                      <td>
                        <input
                          name="orderId"
                          value={editForm.orderId}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          name="companyName"
                          value={editForm.companyName}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          name="quantity"
                          type="number"
                          value={editForm.quantity}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          name="discount"
                          type="number"
                          value={editForm.discount}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          name="date"
                          type="date"
                          value={editForm.date}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </td>
                      <td className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={handleEditSubmit}
                          title="Save"
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditId(null)}
                          title="Cancel"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={order._id}>
                      <td>{order.orderId}</td>
                      <td>{order.companyName}</td>
                      <td>{order.quantity}</td>
                      <td>{order.discount}</td>
                      <td>{order.date ? order.date.slice(0, 10) : ""}</td>
                      <td className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEdit(order)}
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(order._id)}
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* View Report Button */}
          <div className="report-button-container">
            <button
              className="btn btn-view"
              onClick={() => navigate("/dashboard/orders/report")}
            >
              <FontAwesomeIcon icon={faEye} />
              View Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ManageOrders;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManagePurchases.css";

const ManagePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [editingPurchase, setEditingPurchase] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get("/api/purchase");
      setPurchases(response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/purchase/${id}`);
      setPurchases(purchases.filter((purchase) => purchase._id !== id));
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  const handleEditClick = (purchase) => {
    setEditingPurchase({ ...purchase });
  };

  const handleEditChange = (e) => {
    setEditingPurchase({ ...editingPurchase, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/purchase/${editingPurchase._id}`, editingPurchase);
      setEditingPurchase(null);
      fetchPurchases();
    } catch (error) {
      console.error("Error updating purchase:", error);
    }
  };

  return (
    <div className="manage-purchases-container">
      <h2>Manage Purchases</h2>
      <table className="purchases-table">
        <thead>
          <tr>
            <th>Supplier</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase._id}>
              <td>{purchase.supplierName}</td>
              <td>{purchase.productName}</td>
              <td>{purchase.quantity}</td>
              <td>{purchase.price}</td>
              <td>{new Date(purchase.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEditClick(purchase)}>Edit</button>
                <button onClick={() => handleDelete(purchase._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingPurchase && (
        <form onSubmit={handleEditSubmit} className="edit-purchase-form">
          <h3>Edit Purchase</h3>
          <input
            type="text"
            name="supplierName"
            value={editingPurchase.supplierName}
            onChange={handleEditChange}
            required
          />
          <input
            type="text"
            name="productName"
            value={editingPurchase.productName}
            onChange={handleEditChange}
            required
          />
          <input
            type="number"
            name="quantity"
            value={editingPurchase.quantity}
            onChange={handleEditChange}
            required
          />
          <input
            type="number"
            name="price"
            value={editingPurchase.price}
            onChange={handleEditChange}
            required
          />
          <input
            type="date"
            name="date"
            value={editingPurchase.date.slice(0, 10)}
            onChange={handleEditChange}
            required
          />
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditingPurchase(null)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ManagePurchases;

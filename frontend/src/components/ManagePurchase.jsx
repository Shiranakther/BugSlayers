import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManagePurchases.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const ManagePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermDate, setSearchTermDate] = useState('');

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

  const filteredPurchases = purchases.filter((purchase) =>
    (purchase.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     purchase.productName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (searchTermDate
      ? new Date(purchase.date).toLocaleDateString() === new Date(searchTermDate).toLocaleDateString()
      : true)
  );

  return (
    <div className="manage-purchases-container">
      <h2>
        <FontAwesomeIcon icon={faClipboardList} className="ms-icon" /> Manage Purchases Records
      </h2>

      {/* Search by supplier or product name */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by supplier or product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Search by date */}
      <div className="mb-3">
        <input
          type="date"
          className="form-control"
          value={searchTermDate}
          onChange={(e) => setSearchTermDate(e.target.value)}
        />
      </div>

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
          {filteredPurchases.map((purchase) => (
            <tr key={purchase._id}>
              <td>{purchase.supplierName}</td>
              <td>{purchase.productName}</td>
              <td>{purchase.quantity}</td>
              <td>{purchase.price}</td>
              <td>{new Date(purchase.date).toLocaleDateString()}</td>
              <td>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary w-100" onClick={() => handleEditClick(purchase)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger w-100" onClick={() => handleDelete(purchase._id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
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
          <div className="mt-2">
            <button type="submit" className="btn btn-success me-2">Update</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditingPurchase(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManagePurchases;

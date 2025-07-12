import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManagePurchases.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faClipboardList } from "@fortawesome/free-solid-svg-icons";

const ManagePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermDate, setSearchTermDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get("/api/purchase");
      setPurchases(response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  useEffect(() => {
    fetchPurchases();

    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/category");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const res = await axios.get("/api/subcategories");
        setSubcategories(res.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    if (editingPurchase && editingPurchase.category) {
      const fetchSubsForCategory = async () => {
        try {
          const res = await axios.get(`/api/subcategories/by-category/${editingPurchase.category}`);
          setSubcategories(res.data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setSubcategories([]);
        }
      };
      fetchSubsForCategory();
    }
  }, [editingPurchase?.category]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase?")) return;
    try {
      await axios.delete(`/api/purchase/${id}`);
      setPurchases(purchases.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  const handleEditClick = (purchase) => {
    const dateStr = purchase.date ? purchase.date.slice(0, 10) : "";
    setEditingPurchase({
      ...purchase,
      date: dateStr,
      discount: purchase.discount ?? 0,
      discountType: "%", // Always use percentage
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingPurchase((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subcategory: "" } : {}),
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const {
      supplierName,
      productName,
      category,
      subcategory,
      quantity,
      price,
      discount,
      date,
      _id,
    } = editingPurchase;

    if (!supplierName || !productName || !category || !subcategory || !quantity || !price || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    const discountValue = Number(discount) || 0;
    const qty = Number(quantity);
    const unitPrice = Number(price);
    const subtotal = qty * unitPrice;

    if (discountValue > 100) {
      alert("Discount percentage cannot be more than 100%");
      return;
    }

    try {
      await axios.put(`/api/purchase/${_id}`, {
        ...editingPurchase,
        discount: discountValue,
        discountType: "%",
      });
      setEditingPurchase(null);
      fetchPurchases();
    } catch (error) {
      console.error("Error updating purchase:", error);
      alert("Failed to update purchase. Please try again.");
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.categoryName : id;
  };

  const getSubcategoryName = (id) => {
    const sub = subcategories.find((s) => s._id === id);
    return sub ? sub.subcategoryName : id;
  };

  const calculateTotal = (purchase) => {
    const qty = Number(purchase.quantity) || 0;
    const price = Number(purchase.price) || 0;
    const discount = Number(purchase.discount) || 0;
    const subtotal = qty * price;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;
    return Math.max(0, total);
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const searchLower = searchTerm.toLowerCase();
    const matchText =
      purchase.supplierName.toLowerCase().includes(searchLower) ||
      purchase.productName.toLowerCase().includes(searchLower);

    const matchDate = searchTermDate
      ? new Date(purchase.date).toISOString().slice(0, 10) === searchTermDate
      : true;

    return matchText && matchDate;
  });

  return (
    <div className="manage-purchases-container">
      <h2>
        <FontAwesomeIcon icon={faClipboardList} className="ms-icon" /> Manage Purchases Records
      </h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by supplier or product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="date"
          className="form-control"
          value={searchTermDate}
          onChange={(e) => setSearchTermDate(e.target.value)}
        />
      </div>

      <table className="purchases-table table table-striped table-bordered text-center">
        <thead>
          <tr>
            <th>Purchase ID</th>
            <th>Supplier</th>
            <th>Product</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Quantity</th>
            <th>Price (Rs.)</th>
            <th>Discount (%)</th>
            <th>Total Purchase (Rs.)</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPurchases.map((purchase, index) => {
            const total = calculateTotal(purchase);
            const discount = Number(purchase.discount) || 0;

            return (
              <tr key={purchase._id}>
                <td>{purchase.purchaseId || `PUR-${String(index + 1).padStart(3, "0")}`}</td>
                <td>{purchase.supplierName}</td>
                <td>{purchase.productName}</td>
                <td>{getCategoryName(purchase.category)}</td>
                <td>{getSubcategoryName(purchase.subcategory)}</td>
                <td>{purchase.quantity}</td>
                <td>{Number(purchase.price).toFixed(2)}</td>
                <td>{discount > 0 ? `${discount}%` : "-"}</td>
                <td>{total.toFixed(2)}</td>
                <td>{new Date(purchase.date).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEditClick(purchase)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(purchase._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {filteredPurchases.length === 0 && (
            <tr>
              <td colSpan="11" className="text-center">
                No purchases found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingPurchase && (
        <div className="edit-form-container mt-4">
          <form onSubmit={handleEditSubmit} className="form">
            <h4 className="form-title mb-4 text-lg font-semibold">
              <FontAwesomeIcon icon={faEdit} /> Edit Purchase
            </h4>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label>Supplier Name</label>
                <input
                  type="text"
                  name="supplierName"
                  value={editingPurchase.supplierName}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={editingPurchase.productName}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Category</label>
                <select
                  name="category"
                  value={editingPurchase.category}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label>Subcategory</label>
                <select
                  name="subcategory"
                  value={editingPurchase.subcategory}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.subcategoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={editingPurchase.quantity}
                  onChange={handleEditChange}
                  required
                  min="1"
                />
              </div>

              <div className="flex flex-col">
                <label>Product Price (Rs.)</label>
                <input
                  type="number"
                  name="price"
                  value={editingPurchase.price}
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex flex-col">
                <label>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={editingPurchase.discount}
                  onChange={handleEditChange}
                  min="0"
                  step="0.01"
                  max="100"
                  placeholder="Discount (%)"
                />
              </div>

              <div className="flex flex-col">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={editingPurchase.date}
                  onChange={handleEditChange}
                  required
                />
              </div>
            </div>

            {/* Total Preview */}
            <div className="total-preview" style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '5px',
              marginTop: '15px',
              border: '1px solid #dee2e6'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Subtotal ({editingPurchase.quantity} × Rs.{editingPurchase.price}):</span>
                <span>Rs. {((Number(editingPurchase.quantity) || 0) * (Number(editingPurchase.price) || 0)).toFixed(2)}</span>
              </div>
              {editingPurchase.discount && Number(editingPurchase.discount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#dc3545' }}>
                  <span>Discount ({editingPurchase.discount}%):</span>
                  <span>- Rs. {(((Number(editingPurchase.quantity) || 0) * (Number(editingPurchase.price) || 0) * (Number(editingPurchase.discount) || 0)) / 100).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px', borderTop: '1px solid #dee2e6', paddingTop: '5px' }}>
                <span>Total Purchase:</span>
                <span>Rs. {calculateTotal(editingPurchase).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button type="submit" className="btnUpdate">
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditingPurchase(null)}
                className="btnClose"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManagePurchases;

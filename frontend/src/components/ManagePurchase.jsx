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

  // Fetch all purchases
  const fetchPurchases = async () => {
    try {
      const response = await axios.get("/api/purchase");
      setPurchases(response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  // Fetch categories on mount
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
    fetchCategories();
  }, []);

  // Fetch subcategories when editingPurchase.category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (editingPurchase && editingPurchase.category) {
        try {
          console.log("Fetching subcategories for category:", editingPurchase.category);
          const res = await axios.get(`/api/subcategories/by-category/${editingPurchase.category}`);
          console.log("Subcategories fetched:", res.data);
          setSubcategories(res.data || []);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setSubcategories([]);
        }
      } else {
        setSubcategories([]);
      }
    };
    fetchSubcategories();
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
    // Format date to YYYY-MM-DD
    const dateStr = purchase.date ? purchase.date.slice(0, 10) : "";
    setEditingPurchase({
      ...purchase,
      date: dateStr,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    // Reset subcategory when category changes
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
      date,
      _id,
    } = editingPurchase;

    if (
      !supplierName ||
      !productName ||
      !category ||
      !subcategory ||
      !quantity ||
      !price ||
      !date
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.put(`/api/purchase/${_id}`, editingPurchase);
      setEditingPurchase(null);
      fetchPurchases();
    } catch (error) {
      console.error("Error updating purchase:", error);
      alert("Failed to update purchase. Please try again.");
    }
  };

  // Helper to get category name by id
  const getCategoryName = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.categoryName : id;
  };

  // Helper to get subcategory name by id from current subcategories list
  const getSubcategoryName = (id) => {
    const sub = subcategories.find((s) => s._id === id);
    return sub ? sub.subcategoryName : id;
  };

  // Filter purchases by search text and date
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

      {/* Search Inputs */}
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
            <th style={{ width: "10%" }}>Supplier</th>
            <th style={{ width: "10%" }}>Product</th>
            <th style={{ width: "10%" }}>Category</th>
            <th style={{ width: "10%" }}>Subcategory</th>
            <th style={{ width: "7%" }}>Quantity</th>
            <th style={{ width: "8%" }}>Price (Rs.)</th>
            <th style={{ width: "10%" }}>Total Purchase (Rs.)</th>
            <th style={{ width: "10%" }}>Date</th>
            <th style={{ width: "15%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPurchases.map((purchase) => (
            <tr key={purchase._id}>
              <td>{purchase.supplierName}</td>
              <td>{purchase.productName}</td>
              <td>{getCategoryName(purchase.category)}</td>
              <td>{getSubcategoryName(purchase.subcategory)}</td>
              <td>{purchase.quantity}</td>
              <td>{purchase.price.toFixed(2)}</td>
              <td>{(purchase.quantity * purchase.price).toFixed(2)}</td>
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
          ))}
          {filteredPurchases.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center">
                No purchases found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Form */}
      {editingPurchase && (
        <div className="edit-form-container mt-4">
          <form onSubmit={handleEditSubmit} className="form">
            <h4 className="form-title mb-4 text-lg font-semibold">
              <FontAwesomeIcon icon={faEdit} /> Edit Purchase
            </h4>

            <div className="grid grid-cols-2 gap-6">
              {/* Supplier */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Supplier Name</label>
                <input
                  type="text"
                  name="supplierName"
                  value={editingPurchase.supplierName}
                  onChange={handleEditChange}
                  required
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Product */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={editingPurchase.productName}
                  onChange={handleEditChange}
                  required
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={editingPurchase.category}
                  onChange={handleEditChange}
                  required
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Subcategory</label>
                <select
                  name="subcategory"
                  value={editingPurchase.subcategory}
                  onChange={handleEditChange}
                  required
                  disabled={!editingPurchase.category} // Keep disabled if no category selected
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.subcategoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={editingPurchase.quantity}
                  onChange={handleEditChange}
                  required
                  min="1"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Price (Rs.)</label>
                <input
                  type="number"
                  name="price"
                  value={editingPurchase.price}
                  onChange={handleEditChange}
                  required
                  min="0"
                  step="0.01"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={editingPurchase.date}
                  onChange={handleEditChange}
                  required
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="submit"
                className="btnUpdate px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditingPurchase(null)}
                className="btnClose px-5 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
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

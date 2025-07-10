import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import "./AddPurchases.css";

const AddPurchase = () => {
  const [purchase, setPurchase] = useState({
    supplierName: "",
    productName: "",
    category: "",
    subcategory: "",
    quantity: "",
    price: "",
    date: "",
  });
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch suppliers on mount
  useEffect(() => {
    axios.get("/api/suppliers")
      .then(res => setSuppliers(res.data))
      .catch(err => console.error("Error fetching suppliers:", err));
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    axios.get("/api/category")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // Update purchase state on form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchase(prev => ({
      ...prev,
      [name]: value,
      // Reset subcategory if category changed (optional)
      ...(name === "category" && { subcategory: "" })
    }));
  };

  // Submit purchase form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!purchase.supplierName || !purchase.productName || !purchase.category || !purchase.subcategory
        || !purchase.quantity || !purchase.price || !purchase.date) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post("/api/purchase", purchase);
      alert("Purchase added successfully!");
      setPurchase({
        supplierName: "",
        productName: "",
        category: "",
        subcategory: "",
        quantity: "",
        price: "",
        date: "",
      });
    } catch (error) {
      console.error("Error adding purchase:", error);
      alert("Failed to add purchase. Please try again.");
    }
  };

  return (
    <div className="add-purchase-container">
      <div className="title">
        <FontAwesomeIcon icon={faSquarePlus} /> Add Purchase
      </div>

      <form onSubmit={handleSubmit} className="add-purchase-form">

        <select
          name="supplierName"
          value={purchase.supplierName}
          onChange={handleChange}
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map(s => (
            <option key={s._id} value={s.supplierName}>{s.supplierName}</option>
          ))}
        </select>

        <input
          type="text"
          name="productName"
          value={purchase.productName}
          onChange={handleChange}
          placeholder="Product Title"
          required
        />

        {/* Category and Subcategory use the same categories list */}
        <div className="row-input-group">
          <select
            name="category"
            value={purchase.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.categoryName}</option>
            ))}
          </select>

          <select
            name="subcategory"
            value={purchase.subcategory}
            onChange={handleChange}
            required
          >
            <option value="">Select Subcategory</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.categoryName}</option>
            ))}
          </select>
        </div>

        <input
          type="number"
          name="quantity"
          value={purchase.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
          min="1"
        />

        <input
          type="number"
          name="price"
          value={purchase.price}
          onChange={handleChange}
          placeholder="Price"
          required
          min="0"
          step="0.01"
        />

        <input
          type="date"
          name="date"
          value={purchase.date}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary">Add New Record</button>
      </form>
    </div>
  );
};

export default AddPurchase;

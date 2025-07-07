import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddPurchases.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

const AddPurchase = () => {
  const [purchase, setPurchase] = useState({
    supplierName: "",
    productName: "",
    quantity: "",
    price: "",
    date: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch suppliers and extract unique product names
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/suppliers");
        setSuppliers(res.data);

        // Extract unique product names from all suppliers
        const allProducts = res.data.flatMap(s => s.products || []);
        const uniqueProducts = [...new Set(allProducts)];
        setProducts(uniqueProducts);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };

    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setPurchase({ ...purchase, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/purchase", purchase);
      alert("Purchase added successfully!");
      setPurchase({
        supplierName: "",
        productName: "",
        quantity: "",
        price: "",
        date: "",
      });
    } catch (error) {
      console.error("Error adding purchase:", error);
    }
  };

  return (
    <div className="add-purchase-container">
      <div className='text-center' style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
        <FontAwesomeIcon icon={faSquarePlus} /> Add Purchase
      </div>
      <form onSubmit={handleSubmit} className="add-purchase-form">
        {/* Supplier Dropdown */}
        <select
          name="supplierName"
          value={purchase.supplierName}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Supplier --</option>
          {suppliers.map((supplier, index) => (
            <option key={index} value={supplier.supplierName}>
              {supplier.supplierName}
            </option>
          ))}
        </select>

        {/* Product Dropdown */}
        <select
          name="productName"
          value={purchase.productName}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Product --</option>
          {products.map((product, index) => (
            <option key={index} value={product}>
              {product}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          value={purchase.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
        />
        <input
          type="number"
          name="price"
          value={purchase.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="date"
          name="date"
          value={purchase.date}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary w-100">
          <FontAwesomeIcon className="me-2" /> Add New Record
        </button>
      </form>
    </div>
  );
};

export default AddPurchase;

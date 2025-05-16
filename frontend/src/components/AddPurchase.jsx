import React, { useState } from "react";
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

  const handleChange = (e) => {
    setPurchase({ ...purchase, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/purchase", purchase);
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
        <input
          type="text"
          name="supplierName"
          value={purchase.supplierName}
          onChange={handleChange}
          placeholder="Supplier Name"
          required
        />
        <input
          type="text"
          name="productName"
          value={purchase.productName}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
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
                  <FontAwesomeIcon className="me-2" />Add New Record
                </button>
      </form>
    </div>
  );
};

export default AddPurchase;

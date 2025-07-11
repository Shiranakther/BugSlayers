import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddOrder = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    orderId: '',
    companyName: '',
    quantity: '',
    discount: '',
    date: '',
  });
  const [message, setMessage] = useState('');
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Auto-generate Order ID on load
  useEffect(() => {
    generateOrderId();
    fetchSuppliers();
  }, []);

  const generateOrderId = () => {
    const uniqueId = `ORD-${Date.now()}`;
    setForm((prevForm) => ({ ...prevForm, orderId: uniqueId }));
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/suppliers`);
      setSuppliers(res.data);
    } catch (err) {
      console.error('Failed to fetch suppliers', err);
    }
  };

  // SINGLE handleChange function
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { orderId, companyName, quantity, discount, date } = form;

    if (!orderId || !companyName || !quantity || !discount || !date) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/orders`, {
        orderId,
        companyName,
        quantity: Number(quantity),
        discount: Number(discount),
        date,
      });

      setMessage('✅ Order added successfully!');
      generateOrderId(); // Generate next orderId after successful add
      setForm({
        orderId: '',
        companyName: '',
        quantity: '',
        discount: '',
        date: '',
      });
    } catch (err) {
      if (err.response?.data?.error?.includes('Order ID already exists')) {
        setMessage('❌ Order ID already exists. Please try again.');
        generateOrderId();
      } else {
        setMessage('❌ Failed to add order. Please check your input.');
      }
    }
  };

  return (
    <div
      className="container mt-5"
      style={{
        maxWidth: 500,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        padding: 32,
      }}
    >
      <h2 className="mb-4 text-center" style={{ fontWeight: 600, letterSpacing: 1 }}>
        Add New Order
      </h2>

      {message && (
        <div className="alert alert-info text-center" style={{ borderRadius: 8 }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="orderId">
            Order ID
          </label>
          <input
            className="form-control"
            id="orderId"
            placeholder="Order ID"
            name="orderId"
            value={form.orderId}
            onChange={handleChange}
            readOnly // Order ID is read-only (auto-generated)
            required
          />
        </div>



        <div className="mb-3">
          <label className="form-label" htmlFor="companyName">
            Supplier
          </label>
          <select
            className="form-control"
            id="companyName"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Supplier --</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier.supplierName}>
                {supplier.supplierName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="quantity">
            Quantity
          </label>
          <input
            className="form-control"
            id="quantity"
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            min={1}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="discount">
            Discount
          </label>
          <input
            className="form-control"
            id="discount"
            type="number"
            name="discount"
            placeholder="Discount"
            value={form.discount}
            onChange={handleChange}
            min={0}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label" htmlFor="date">
            Date
          </label>
          <input
            className="form-control"
            id="date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="btn btn-primary w-100"
          style={{ fontWeight: 500, letterSpacing: 1, borderRadius: 8, transition: 'background 0.2s' }}
          type="submit"
        >
          Add Order
        </button>
      </form>
    </div>
  );
};

export default AddOrder;

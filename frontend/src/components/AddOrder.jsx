import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddOrder = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    orderId: '',
    companyName: '',
    productName: '',
    category: '',
    subcategory: '',
    quantity: '',
    discount: '',
    date: '',
    status: 'Pending',
  });
  const [message, setMessage] = useState('');
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    generateOrderId();
    fetchSuppliers();
    fetchCategories();
  }, []);

  const generateOrderId = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders`);
      const allOrders = res.data;
      const lastOrder = allOrders.length > 0 ? allOrders[allOrders.length - 1].orderId : null;

      let nextId = 1;
      if (lastOrder && /^ORD\d+$/.test(lastOrder)) {
        const numPart = parseInt(lastOrder.replace("ORD", ""), 10);
        nextId = numPart + 1;
      }

      const formattedId = `ORD${String(nextId).padStart(3, "0")}`;
      setForm((prev) => ({ ...prev, orderId: formattedId }));
    } catch (error) {
      console.error("Error generating Order ID", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/suppliers`);
      setSuppliers(res.data);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/category`);
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" && { subcategory: "" })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      orderId, companyName, productName, category,
      subcategory, quantity, discount, date, status,
    } = form;

    if (!orderId || !companyName || !productName || !category || !subcategory || !quantity || !discount || !date || !status) {
      setMessage('Please fill all fields.');
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/orders`, {
        orderId,
        companyName,
        productName,
        category,
        subcategory,
        quantity: Number(quantity),
        discount: Number(discount),
        date,
        status,
      });

      setMessage('✅ Order added successfully!');
      generateOrderId();
      setForm({
        orderId: '',
        companyName: '',
        productName: '',
        category: '',
        subcategory: '',
        quantity: '',
        discount: '',
        date: '',
        status: 'Pending',
      });
    } catch (err) {
      setMessage('❌ Failed to add order. Please try again.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 700, padding: 32, background: '#fff', borderRadius: 12 }}>
      <h2 className="mb-4 text-center">Add Order</h2>
      {message && <div className="alert alert-info text-center">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-3" name="orderId" value={form.orderId} readOnly />

        <select className="form-control mb-3" name="companyName" value={form.companyName} onChange={handleChange} required>
          <option value="">Select Supplier</option>
          {suppliers.map((s) => <option key={s._id} value={s.supplierName}>{s.supplierName}</option>)}
        </select>

        <input className="form-control mb-3" name="productName" value={form.productName} onChange={handleChange} placeholder="Product Name" required />

        <div className="d-flex gap-3 mb-3">
          <select className="form-control w-50" name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c._id} value={c.categoryName}>{c.categoryName}</option>)}
          </select>

          <select className="form-control w-50" name="subcategory" value={form.subcategory} onChange={handleChange} required>
            <option value="">Select Subcategory</option>
            {categories
              .filter((c) => c.categoryName === form.category)
              .flatMap((c) => c.subcategories)
              .map((sub, i) => (
                <option key={i} value={sub}>{sub}</option>
              ))}
          </select>
        </div>

        <input type="number" className="form-control mb-3" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} min={1} required />
        <input type="number" className="form-control mb-3" name="discount" placeholder="Discount (%)" value={form.discount} onChange={handleChange} min={0} required />
        <input type="date" className="form-control mb-3" name="date" value={form.date} onChange={handleChange} required />

        <select className="form-control mb-4" name="status" value={form.status} onChange={handleChange} required>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancel">Cancel</option>
        </select>

        <button className="btn btn-primary w-100" type="submit">Add Order</button>
      </form>
    </div>
  );
};

export default AddOrder;

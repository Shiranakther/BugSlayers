import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5"; // Close icon
import './Supplier.css';

const productOptions = {
  Mattress: ['Foam', 'Spring', 'Orthopedic'],
  Cupboard: ['Wooden', 'Plastic', 'Steel'],
  Chair: ['Dining Chair', 'Office Chair', 'Recliner'],
  Table: ['Dining Table', 'Coffee Table', 'Study Table'],
  'Iron Board': ['Standard', 'Wall-mounted'],
  'Carrom Board': ['Full Size', 'Mini'],
  'Clothes Rack': ['Single Pole', 'Double Pole'],
};

const paymentOptions = ['Cash', 'Card'];

const ManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    supplierName: '',
    phone1: '',
    phone2: '',
    fax: '',
    email: '',
    address: '',
    supplyProducts: '',
    paymentTerms: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      alert('❌ Failed to fetch suppliers');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
      fetchSuppliers();
    }
  };

  const handleEditClick = (supplier) => {
    setEditingSupplierId(supplier._id);
    setFormData({
      date: supplier.date ? supplier.date.split('T')[0] : '',
      supplierName: supplier.supplierName || '',
      phone1: supplier.phone1 || '',
      phone2: supplier.phone2 || '',
      fax: supplier.fax || '',
      email: supplier.email || '',
      address: supplier.address || '',
      supplyProducts: Array.isArray(supplier.supplyProducts) && supplier.supplyProducts.length > 0
        ? supplier.supplyProducts[0]
        : (typeof supplier.supplyProducts === 'string' ? supplier.supplyProducts : ''),
      paymentTerms: supplier.paymentTerms || ''
    });
    setShowEditForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/suppliers/${editingSupplierId}`, {
        ...formData,
        supplyProducts: [formData.supplyProducts],
      });
      alert('✅ Supplier updated!');
      setEditingSupplierId(null);
      setShowEditForm(false);
      fetchSuppliers();
    } catch (error) {
      console.error('Error updating supplier:', error);
      alert('❌ Failed to update supplier');
    }
  };

  const cancelEdit = () => {
    setEditingSupplierId(null);
    setShowEditForm(false);
  };

  const clearSearch = () => setSearchTerm('');

  const filteredSuppliers = suppliers.filter(s =>
    s.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <h2>Manage Suppliers</h2>

      {/* Search Input with Clear Icon */}
      <div style={{ marginBottom: '15px', position: 'relative', width: '280px' }}>
        <input
          type="text"
          placeholder="Search by supplier name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 36px 8px 12px',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />
        {searchTerm && (
          <IoCloseCircle
            onClick={clearSearch}
            size={20}
            color="gray"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer'
            }}
            title="Clear search"
          />
        )}
      </div>

      {/* Floating Edit Form */}
      {showEditForm && (
        <div className="edit-form-overlay">
          <h3>Edit Supplier</h3>
          <form onSubmit={handleUpdateSubmit} className="edit-form-grid">
            <div className="form-group-i">
              <label>Date:</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="form-group-i">
              <label>Supplier Name:</label>
              <input name="supplierName" value={formData.supplierName} onChange={handleChange} required />
            </div>
            <div className="form-group-i">
              <label>Phone 1:</label>
              <input name="phone1" value={formData.phone1} onChange={handleChange} required />
            </div>
            <div className="form-group-i">
              <label>Phone 2:</label>
              <input name="phone2" value={formData.phone2} onChange={handleChange} />
            </div>
            <div className="form-group-i">
              <label>Fax:</label>
              <input name="fax" value={formData.fax} onChange={handleChange} />
            </div>
            <div className="form-group-i">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group-i">
              <label>Address:</label>
              <input name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="form-group-i">
              <label>Supply Product:</label>
              <select name="supplyProducts" value={formData.supplyProducts} onChange={handleChange} required>
                <option value="" disabled>Select a product</option>
                {Object.entries(productOptions).map(([category, subs]) => (
                  <optgroup key={category} label={category}>
                    {subs.map((sub) => (
                      <option key={sub} value={`${sub} ${category}`}>
                        {sub}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="form-group-i">
              <label>Payment Terms:</label>
              <select name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} required>
                <option value="" disabled>Select payment method</option>
                {paymentOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="edit-form-actions">
              <button type="submit" className="btn-success">Update</button>
              <button type="button" onClick={cancelEdit} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Supplier Table */}
      {loading ? (
        <p>Loading suppliers...</p>
      ) : (
        <table className="table table-striped table-hover" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Phone 1</th>
              <th>Phone 2</th>
              <th>Fax</th>
              <th>Email</th>
              <th>Address</th>
              <th>Products</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr><td colSpan="10">No suppliers found</td></tr>
            ) : (
              filteredSuppliers.map((s) => (
                <tr key={s._id}>
                  <td>{new Date(s.date).toISOString().split('T')[0]}</td>
                  <td>{s.supplierName}</td>
                  <td>{s.phone1}</td>
                  <td>{s.phone2 || '-'}</td>
                  <td>{s.fax || '-'}</td>
                  <td>{s.email || '-'}</td>
                  <td>{s.address || '-'}</td>
                  <td>{Array.isArray(s.supplyProducts) ? s.supplyProducts.join(', ') : s.supplyProducts || '-'}</td>
                  <td>{s.paymentTerms || '-'}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEditClick(s)}><FaEdit /></button>
                    <button onClick={() => handleDelete(s._id)}><FaTrash /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageSuppliers;

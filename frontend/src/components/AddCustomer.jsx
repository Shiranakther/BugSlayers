import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import './Customer.css';

const AddCustomer = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!/^[0-9]{10}$/.test(contact)) newErrors.contact = "Enter a valid 10-digit contact number";
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) newErrors.email = "Enter a valid @gmail.com email address";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const res = await axios.get('/api/customers');
      const customers = res.data;

      if (customers.some(c => c.email === email)) {
        alert("Customer with this email already exists!");
        return;
      }

      const newCustomer = { name, address, contact, email };

      const response = await axios.post('/api/customers', newCustomer, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        alert("Customer added successfully!");
        setName('');
        setAddress('');
        setContact('');
        setEmail('');
        setErrors({});
      } else {
        alert("Error adding customer. Please try again.");
      }
    } catch (error) {
      console.error("Error Details:", error.response?.data || error.message);
      alert("Error adding customer. Please try again.");
    }
  };

  return (
    <div className="container-c">
      <h4 className="add-title" style={{ textAlign: "left" }}>
        <FontAwesomeIcon icon={faPlusSquare} className="addCus" /> Add New Customer
      </h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <div className="alert alert-danger">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && <div className="alert alert-danger">{errors.address}</div>}
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          {errors.contact && <div className="alert alert-danger">{errors.contact}</div>}
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
          />
          {errors.email && <div className="alert alert-danger">{errors.email}</div>}
        </div>
        <button type="submit" className="btn btn-primary">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomer;

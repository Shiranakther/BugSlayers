import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Supplier.css';

const AddSupplier = () => {
  const [supplier, setSupplier] = useState({
    date: new Date().toISOString().split('T')[0],
    supplierName: '',
    phone1: '',
    phone2: '',
    fax: '',
    email: '',
    address: '',
    supplyProducts: '',
    paymentTerms: '',
  });

  const [errors, setErrors] = useState({});

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const validateFields = (name, value) => {
    let error = '';

    if (name === 'phone1' || name === 'phone2') {
      value = value.replace(/\D/g, '');
      if (value.length > 10) {
        alert('Contact number must not exceed 10 digits');
        value = value.slice(0, 10);
      }
      if (!validatePhoneNumber(value)) {
        error = 'Contact number must be exactly 10 digits and numeric';
      } else if (name === 'phone2' && value === supplier.phone1) {
        error = 'Primary and Secondary Contact Numbers must not be the same';
      }
    }

    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        error = 'Email must be a valid @gmail.com address';
      }
    }

    if (name === 'address' && !value.trim()) {
      error = 'Address cannot be empty';
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return value;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validatedValue = validateFields(name, value);
    setSupplier({ ...supplier, [name]: validatedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    Object.entries(supplier).forEach(([key, value]) => {
      const validated = validateFields(key, value);
      if (errors[key]) hasErrors = true;
    });

    if (Object.values(errors).some((err) => err) || hasErrors) {
      alert("Please fix the validation errors.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/suppliers/add', supplier);
      alert('Supplier added successfully');

      setSupplier({
        date: new Date().toISOString().split('T')[0],
        supplierName: '',
        phone1: '',
        phone2: '',
        fax: '',
        email: '',
        address: '',
        supplyProducts: '',
        paymentTerms: '',
      });

      setErrors({});
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert('Failed to add supplier. Please try again.');
    }
  };

  return (
    <div className="container-i form-container-i" style={{ maxWidth: '50%' }}>
      <div
        className="text-center"
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}
      >
        <FontAwesomeIcon icon={faSquarePlus} /> Add Supplier
      </div>

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group-i">
          <input
            type="date"
            className="form-control"
            name="date"
            value={supplier.date}
            onChange={handleInputChange}
            required
          />
        </div>

        {[
          { label: 'Supplier Name', key: 'supplierName' },
          { label: 'Contact Number (Primary)', key: 'phone1', required: true },
          { label: 'Contact Number (Secondary)', key: 'phone2' },
          { label: 'Fax Number', key: 'fax' },
          { label: 'Email Address', key: 'email' },
          { label: 'Address', key: 'address' },
        ].map((field) => (
          <div key={field.key} className="form-group-i">
            <input
              type="text"
              className="form-control"
              name={field.key}
              value={supplier[field.key]}
              onChange={handleInputChange}
              placeholder={field.label}
              required={field.required || false}
            />
            {errors[field.key] && (
              <div className="alert alert-danger">{errors[field.key]}</div>
            )}
          </div>
        ))}

        <div className="form-group-i">
          <select
            className="form-control"
            name="supplyProducts"
            value={supplier.supplyProducts}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select a product
            </option>
            <option value="Mattress">Mattress</option>
            <option value="Cupboard">Cupboard</option>
            <option value="Chair">Chair</option>
            <option value="Table">Table</option>
            <option value="Iron Board">Iron Board</option>
            <option value="Carrom Board">Carrom Board</option>
            <option value="Clothes Rack">Clothes Rack</option>
          </select>
        </div>

        <div className="form-group-i">
          <select
            className="form-control"
            name="paymentTerms"
            value={supplier.paymentTerms}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select a payment method
            </option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary-i">
          Add Supplier
        </button>
      </form>
    </div>
  );
};

export default AddSupplier;

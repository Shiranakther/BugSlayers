import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
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
  const [existingSupplierNames, setExistingSupplierNames] = useState([]);

  const productOptions = {
    Mattress: ['Foam', 'Spring', 'Orthopedic'],
    Cupboard: ['Wooden', 'Plastic', 'Steel'],
    Chair: ['Dining Chair', 'Office Chair', 'Recliner'],
    Table: ['Dining Table', 'Coffee Table', 'Study Table'],
    'Iron Board': ['Standard', 'Wall-mounted'],
    'Carrom Board': ['Full Size', 'Mini'],
    'Clothes Rack': ['Single Pole', 'Double Pole'],
  };

  useEffect(() => {
    const fetchSupplierNames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/suppliers');
        const names = response.data.map((s) => s.supplierName?.toLowerCase());
        setExistingSupplierNames(names);
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
      }
    };

    fetchSupplierNames();
  }, []);

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const validateFields = (name, value) => {
    let error = '';

    if (name === 'phone1' || name === 'phone2' || name === 'fax') {
      value = value.replace(/\D/g, '');
      if (value.length > 10) {
        alert(`${name === 'fax' ? 'Fax' : 'Contact'} number must not exceed 10 digits`);
        value = value.slice(0, 10);
      }

      if (!validatePhoneNumber(value)) {
        error = `${name === 'fax' ? 'Fax' : 'Contact'} number must be exactly 10 digits and numeric`;
      }

      if (name === 'phone2' && value === supplier.phone1) {
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

    if (name === 'supplyProducts') {
      setSupplier((prev) => ({ ...prev, [name]: value }));
    } else {
      const validatedValue = validateFields(name, value);
      setSupplier((prev) => ({ ...prev, [name]: validatedValue }));
    }
  };

  const handleNameCheck = () => {
    const name = supplier.supplierName.trim().toLowerCase();
    if (!name) return alert("Please enter a supplier name to check.");

    if (existingSupplierNames.includes(name)) {
      alert("Already exists");
    } else {
      alert("No already exists. Add the new supplier");
    }
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
    <div className="page-top-center-container">
      <div className="container-i form-container-i" style={{ maxWidth: '70%' }}>
        <div className="text-center mb-4">
          <FontAwesomeIcon icon={faSquarePlus} /> Add Supplier
        </div>

        {/* Supplier Name Check */}
        <div className="row mb-4 align-items-end gap-2 gap-md-0">
          <div className="col-md-8 d-flex">
            <input
              type="text"
              className="form-control me-2"
              name="supplierName"
              value={supplier.supplierName}
              onChange={handleInputChange}
              placeholder="Enter Supplier Name to Check"
              required
            />
          </div>
          <div className="col-md-4">
            <button
              type="button"
              className="btn btn-secondary same-width-btn"
              onClick={handleNameCheck}
            >
              <FontAwesomeIcon icon={faSearch} /> Check Name
            </button>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="row">
            {[
              { label: 'Date', key: 'date', type: 'date' },
              { label: 'Contact Number (Primary)', key: 'phone1', type: 'text' },
              { label: 'Contact Number (Secondary)', key: 'phone2', type: 'text' },
              { label: 'Fax Number', key: 'fax', type: 'text' },
              { label: 'Email Address', key: 'email', type: 'text' },
              { label: 'Address', key: 'address', type: 'text' },
            ].map((field) => (
              <div className="col-md-6 mb-3" key={field.key}>
                <input
                  type={field.type}
                  className="form-control"
                  name={field.key}
                  value={supplier[field.key]}
                  onChange={handleInputChange}
                  placeholder={field.label}
                  required={field.key === 'phone1' || field.key === 'email' || field.key === 'address'}
                />
                {errors[field.key] && (
                  <div className="alert alert-danger mt-1">{errors[field.key]}</div>
                )}
              </div>
            ))}

            {/* Product Dropdown */}
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                name="supplyProducts"
                value={supplier.supplyProducts}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select a product</option>
                {Object.entries(productOptions).map(([category, subcategories]) => (
                  <optgroup key={category} label={category}>
                    {subcategories.map((sub, idx) => {
                      const fullName = `${sub} ${category}`;
                      return (
                        <option key={idx} value={fullName}>
                          {sub}
                        </option>
                      );
                    })}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                name="paymentTerms"
                value={supplier.paymentTerms}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select a payment method</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary-i same-width-btn">
              Add Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;

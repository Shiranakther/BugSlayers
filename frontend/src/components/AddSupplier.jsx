import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faSearch } from '@fortawesome/free-solid-svg-icons';
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
  const [canSubmit, setCanSubmit] = useState(false);
  const [checkPerformed, setCheckPerformed] = useState(false);

  const productOptions = {
    Mattress: ['Foam', 'Spring', 'Orthopedic'],
    Cupboard: ['Wooden', 'Plastic', 'Steel'],
    Chair: ['Dining Chair', 'Office Chair', 'Recliner'],
    Table: ['Dining Table', 'Coffee Table', 'Study Table'],
    IronBoard: ['Standard', 'Wall-mounted'],
    CarromBoard: ['Full Size', 'Mini'],
    ClothesRack: ['Single Pole', 'Double Pole'],
  };

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const validateFields = (name, value) => {
    let error = '';

    if (name === 'phone1' || name === 'phone2' || name === 'fax') {
      const cleanedValue = value.replace(/\D/g, '');
      if (cleanedValue.length > 10) {
        return { error: `${name === 'fax' ? 'Fax' : 'Contact'} number must not exceed 10 digits`, value: cleanedValue.slice(0, 10) };
      }
      if (value && !validatePhoneNumber(value)) {
        error = `${name === 'fax' ? 'Fax' : 'Contact'} number must be exactly 10 digits`;
      }
      if (name === 'phone2' && value && value === supplier.phone1) {
        error = 'Primary and Secondary Contact Numbers must not be the same';
      }
      return { error, value: cleanedValue };
    }

    if (name === 'email' && value && !validateEmail(value)) {
      error = 'Email must be a valid @gmail.com address';
    }

    if (name === 'address' && !value.trim()) {
      error = 'Address cannot be empty';
    }

    if (name === 'supplierName' && !value.trim()) {
      error = 'Supplier name cannot be empty';
    }

    if (name === 'paymentTerms' && !value) {
      error = 'Payment method is required';
    }

    if (name === 'supplyProducts' && !value) {
      error = 'Product selection is required';
    }

    return { error, value };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const { error, value: validatedValue } = validateFields(name, value);

    setErrors((prev) => ({ ...prev, [name]: error }));
    setSupplier((prev) => ({ ...prev, [name]: validatedValue }));
    setCanSubmit(false); // reset check
    setCheckPerformed(false);
  };

  const handleNameCheck = async () => {
    const name = supplier.supplierName.trim();
    if (!name) return alert("Please enter a supplier name to check.");

    try {
      const response = await axios.get('http://localhost:5000/api/suppliers', {
        params: { search: name }
      });

      if (!Array.isArray(response.data)) {
        console.error('Unexpected response:', response.data);
        alert('Invalid response from server.');
        return;
      }

      const exists = response.data.some(
        (s) => s.supplierName?.toLowerCase() === name.toLowerCase()
      );

      if (exists) {
        alert("Already exists");
        setCanSubmit(false);
      } else {
        alert("No, not found. Add new supplier");
        setCanSubmit(true);
      }

      setCheckPerformed(true);
    } catch (error) {
      console.error('Error checking supplier name:', error);
      alert('Failed to check supplier name. Please ensure backend is running.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkPerformed || !canSubmit) {
      alert("Please check supplier name before submitting.");
      return;
    }

    const validationResults = {};
    let hasErrors = false;

    Object.entries(supplier).forEach(([key, value]) => {
      const { error } = validateFields(key, value);
      validationResults[key] = error;
      if (error) hasErrors = true;
    });

    setErrors(validationResults);

    if (hasErrors) {
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
      setCanSubmit(false);
      setCheckPerformed(false);
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert(error.response?.data?.message || 'Failed to add supplier.');
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
          {errors.supplierName && (
            <div className="alert alert-danger mt-1">{errors.supplierName}</div>
          )}
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
                  required={field.key === 'phone1' || field.key === 'address'}
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
                {Object.entries(productOptions).map(([category, subs]) => (
                  <optgroup key={category} label={category}>
                    {subs.map((sub, i) => (
                      <option key={i} value={`${sub} ${category}`}>
                        {sub}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.supplyProducts && (
                <div className="alert alert-danger mt-1">{errors.supplyProducts}</div>
              )}
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
              {errors.paymentTerms && (
                <div className="alert alert-danger mt-1">{errors.paymentTerms}</div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-4">
            <button className="btn-add-supplier">Add Supplier</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;

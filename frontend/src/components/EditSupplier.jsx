import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import './Supplier.css';

const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState({
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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/suppliers/${id}`);
        setSupplier({
          ...response.data,
          date: new Date(response.data.date).toISOString().split('T')[0]
        });
      } catch (error) {
        console.error('Error fetching supplier:', error);
      }
    };

    fetchSupplier();
  }, [id]);

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const validateFields = (name, value) => {
    let error = '';
    let validatedValue = value;

    if (name === 'phone1' || name === 'phone2') {
      validatedValue = value.replace(/\D/g, '');
      if (validatedValue.length > 10) {
        alert('Contact number must not exceed 10 digits');
        validatedValue = validatedValue.slice(0, 10);
      }

      if (validatedValue && !validatePhoneNumber(validatedValue)) {
        error = 'Contact number must be exactly 10 digits and numeric';
      }

      if (name === 'phone2' && validatedValue && validatedValue === supplier.phone1) {
        error = 'Primary and Secondary Contact Numbers must not be the same';
      }
    }

    if (name === 'email' && validatedValue && !validateEmail(validatedValue)) {
      error = 'Email must be a valid @gmail.com address';
    }

    if (name === 'address' && !validatedValue.trim()) {
      error = 'Address cannot be empty';
    }

    return { validatedValue, error };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const { validatedValue, error } = validateFields(name, value);

    setSupplier((prev) => ({
      ...prev,
      [name]: validatedValue
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    let valid = true;

    for (let field in supplier) {
      const { validatedValue, error } = validateFields(field, supplier[field]);
      if (error) {
        valid = false;
        newErrors[field] = error;
      }
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
      await axios.put(`http://localhost:5000/api/suppliers/${id}`, supplier);
      alert('✅ Supplier updated successfully!');
      navigate('/dashboard/suppliers/manage');
    } catch (error) {
      console.error('❌ Error updating supplier:', error);
      alert('❌ Failed to update supplier. Try again.');
    }
  };

  return (
    <div className="container-i form-container-i">
      <div className='text-center'><FaEdit /> Edit Supplier</div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-grid-2col">
          <div className="form-group-i full-width">
            <input
              type="date"
              className="form-control-i"
              name="date"
              value={supplier.date}
              onChange={handleChange}
              required
            />
          </div>

          {[{ placeholder: "Supplier Name", key: "supplierName", required: true },
            { placeholder: "Contact Number (Primary)", key: "phone1", required: true },
            { placeholder: "Contact Number (Secondary)", key: "phone2", required: false },
            { placeholder: "Fax Number", key: "fax", required: false },
            { placeholder: "Email Address", key: "email", required: false },
            { placeholder: "Address", key: "address", required: true }].map(field => (
            <div key={field.key} className="form-group-i">
              <input
                type="text"
                className="form-control-i"
                name={field.key}
                value={supplier[field.key]}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
              />
              {errors[field.key] && <div className="alert alert-danger">{errors[field.key]}</div>}
            </div>
          ))}

          <div className="form-group-i">
            <select
              className="form-control-i"
              name="supplyProducts"
              value={supplier.supplyProducts}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a product</option>
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
              className="form-control-i"
              name="paymentTerms"
              value={supplier.paymentTerms}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a payment method</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <button type="submit" className="btn btn-primary-i">Update Supplier</button>
          <button type="button" className="btn btn-primary-i" onClick={() => navigate('/dashboard/suppliers/manage')}>Back to Manage</button>
        </div>
      </form>
    </div>
  );
};

export default EditSupplier;

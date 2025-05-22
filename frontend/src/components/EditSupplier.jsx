import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit } from 'react-icons/fa';  // Importing the Edit Icon from React Icons
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
    if (id) {
      const fetchSupplier = async () => {
        try {
          const response = await axios.get(`/api/suppliers/${id}`);
          setSupplier({ ...response.data, date: new Date(response.data.date).toISOString().split('T')[0] });
        } catch (error) {
          console.error('Error fetching supplier:', error);
        }
      };
      fetchSupplier();
    }
  }, [id]);

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);

  const validateFields = (name, value) => {
    let error = '';
    if (name === 'phone1' || name === 'phone2') {
      value = value.replace(/\D/g, ''); // Remove non-numeric characters
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
    setErrors((prev) => ({ ...prev, [name]: error }));
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validatedValue = validateFields(name, value);
    setSupplier({ ...supplier, [name]: validatedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let field in supplier) {
      validateFields(field, supplier[field]);
    }
    if (Object.values(errors).some((err) => err)) return;

    try {
      await axios.put(`/api/suppliers/${id}`, supplier);
      alert('Supplier updated successfully!');
      navigate('/dashboard/suppliers/manage');
    } catch (error) {
      console.error('Error updating supplier:', error);
      alert('Error updating supplier. Please try again.');
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="form-container col-md-6 border p-4 rounded">
        <h2><FaEdit /> Edit Supplier</h2> {/* Added Font Awesome Icon */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" name="date" value={supplier.date} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Supplier Name</label>
            <input type="text" className="form-control" name="supplierName" value={supplier.supplierName} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone1</label>
            <input type="text" className="form-control" name="phone1" value={supplier.phone1} onChange={handleChange} required />
            {errors.phone1 && <div className="alert alert-danger">{errors.phone1}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Phone2</label>
            <input type="text" className="form-control" name="phone2" value={supplier.phone2} onChange={handleChange} />
            {errors.phone2 && <div className="alert alert-danger">{errors.phone2}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Fax</label>
            <input type="text" className="form-control" name="fax" value={supplier.fax} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={supplier.email} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input type="text" className="form-control" name="address" value={supplier.address} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Supply Products</label>
            <input type="text" className="form-control" name="supplyProducts" value={supplier.supplyProducts} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Payment Terms</label>
            <input type="text" className="form-control" name="paymentTerms" value={supplier.paymentTerms} onChange={handleChange} required />
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary w-auto">Update Supplier</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplier;
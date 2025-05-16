import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSquarePlus, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Inventory.css';

const AddInventoryItem = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const validateFields = () => {
    const errors = {};
    if (!productName.trim()) errors.productName = 'Product name is required';
    if (!category) errors.category = 'Category is required';
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0)
      errors.quantity = 'Enter a valid quantity';
    if (!buyingPrice || isNaN(buyingPrice) || Number(buyingPrice) < 0)
      errors.buyingPrice = 'Enter a valid buying price';
    if (!sellingPrice || isNaN(sellingPrice) || Number(sellingPrice) < 0)
      errors.sellingPrice = 'Enter a valid selling price';
    if (!dateAdded) errors.dateAdded = 'Date is required';
    if (!image) errors.image = 'Product image is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratedCode('');
    setError('');
    const errors = validateFields();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('category', category);
    formData.append('quantity', Number(quantity));
    formData.append('buyingPrice', parseFloat(buyingPrice).toFixed(2));
    formData.append('sellingPrice', parseFloat(sellingPrice).toFixed(2));
    formData.append('dateAdded', dateAdded);
    formData.append('image', image);

    try {
      const response = await axios.post('/api/inventory/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const addedItem = response.data;
      setGeneratedCode(addedItem.code || 'Code not returned');
      setProductName('');
      setCategory('');
      setQuantity('');
      setBuyingPrice('');
      setSellingPrice('');
      setDateAdded('');
      setImage(null);
      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      setError(error.response?.data?.error || 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-i mt-4">
      <div className="form-title-i">
        <span className="form-icon-i"><FontAwesomeIcon icon={faSquarePlus} /></span> Add New Product
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group-i">
          <input type="text" className="form-control" placeholder="Product Title"
            value={productName} onChange={(e) => setProductName(e.target.value)} />
          {fieldErrors.productName && <div className="text-danger">{fieldErrors.productName}</div>}
        </div>

        <div className="form-group-i">
          <select className="form-control-i" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
            ))}
          </select>
          {fieldErrors.category && <div className="text-danger">{fieldErrors.category}</div>}
        </div>

        <div className="form-row-i">
          <div className="form-group-i input-icon-i">
            <span className="icon"><FontAwesomeIcon icon={faShoppingCart} /></span>
            <input type="number" className="form-control-i" placeholder="Product Quantity"
              value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            {fieldErrors.quantity && <div className="text-danger">{fieldErrors.quantity}</div>}
          </div>
        </div>

        <div className="form-row-i">
          <div className="form-group-i input-icon-i">
            <span className="icon"><FontAwesomeIcon icon={faDollarSign} /></span>
            <input type="number" className="form-control-i" placeholder="Buying Price"
              min="0" step="0.01" value={buyingPrice} onChange={(e) => setBuyingPrice(e.target.value)} />
            {fieldErrors.buyingPrice && <div className="text-danger">{fieldErrors.buyingPrice}</div>}
          </div>
          <div className="form-group-i input-icon-i">
            <span className="icon"><FontAwesomeIcon icon={faDollarSign} /></span>
            <input type="number" className="form-control-i" placeholder="Selling Price"
              min="0" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
            {fieldErrors.sellingPrice && <div className="text-danger">{fieldErrors.sellingPrice}</div>}
          </div>
        </div>

        <div className="form-group-i">
          <input type="date" className="form-control" value={dateAdded} onChange={(e) => setDateAdded(e.target.value)} />
          {fieldErrors.dateAdded && <div className="text-danger">{fieldErrors.dateAdded}</div>}
        </div>

        <div className="form-group-i">
          <input type="file" className="form-control" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          {fieldErrors.image && <div className="text-danger">{fieldErrors.image}</div>}
        </div>

        <button type="submit" className="btn btn-primary-i" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>

        {error && <div className="alert alert-danger-i mt-3">{error}</div>}
        {generatedCode && <div className="alert alert-success-i mt-3"><strong>Generated Code:</strong> {generatedCode}</div>}
      </form>
    </div>
  );
};

export default AddInventoryItem;

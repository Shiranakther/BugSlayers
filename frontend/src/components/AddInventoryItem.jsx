// Frontend: AddInventoryItem.js
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedCode('');
  
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('category', category);
    formData.append('quantity', Number(quantity));
    formData.append('buyingPrice', parseFloat(buyingPrice).toFixed(2));
    formData.append('sellingPrice', parseFloat(sellingPrice).toFixed(2));
    formData.append('dateAdded', dateAdded);
    if (image) formData.append('image', image);
  
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
      <form onSubmit={handleSubmit}>
        <div className="form-group-i">
          <input type="text" className="form-control" placeholder="Product Title" value={productName} onChange={(e) => setProductName(e.target.value)} required />
        </div>
        <div className="form-row-i">
          <div className="form-group-i col">
            <select className="form-control-i" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row-i">
          <div className="form-group-i input-icon-i">
            <span className="icon"><FontAwesomeIcon icon={faShoppingCart} /></span>
            <input type="number" className="form-control-i" placeholder="Product Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          </div>
        </div>
        <div className="form-row-i">
          <div className="form-group-i input-icon-i">
            <span className="icon"><FontAwesomeIcon icon={faDollarSign} /></span>
            <input type="number" className="form-control-i" placeholder="Buying Price" min="0" step="0.01" value={buyingPrice} onChange={(e) => setBuyingPrice(e.target.value)} required />
          </div>
          <div className="form-group-i input-icon-i">
            <span className="icon"><FontAwesomeIcon icon={faDollarSign} /></span>
            <input type="number" className="form-control-i" placeholder="Selling Price" min="0" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} required />
          </div>
        </div>
        <div className="form-group-i">
          <input type="date" className="form-control" value={dateAdded} onChange={(e) => setDateAdded(e.target.value)} required />
        </div>
        <div className="form-group-i">
          <input type="file" className="form-control" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <button type="submit" className="btn btn-primary-i" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button>
        {error && <div className="alert alert-danger-i mt-3">{error}</div>}
        {generatedCode && <div className="alert alert-success-i mt-3"><strong>Generated Code:</strong> {generatedCode}</div>}
      </form>
    </div>
  );
};

export default AddInventoryItem;

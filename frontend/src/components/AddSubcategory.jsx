import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Inventory.css';

const AddSubcategory = () => {
  const [subcategoryName, setSubcategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Fetch categories for dropdown when component loads
    axios.get('http://localhost:5000/api/category')  // Adjust URL if needed
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!selectedCategory) {
      setError('Please select a category');
      setLoading(false);
      return;
    }
    
    try {
      const newSubcategory = { 
        subcategoryName, 
        categoryId: selectedCategory 
      };
      await axios.post('http://localhost:5000/api/subcategories', newSubcategory);
      setSubcategoryName('');
      setSelectedCategory('');
      alert('Subcategory added successfully!');
    } catch (error) {
      console.error('Error adding subcategory:', error);
      setError('Failed to add subcategory. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-i mt-4">
      <div className='form-title-i'>
        <span className='form-icon-i'><FontAwesomeIcon icon={faFolderPlus} /></span> Add New Subcategory
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group-i">
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group-i">
          <input
            type="text"
            className="form-control"
            placeholder="Subcategory Name"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary-i" disabled={loading}>
          {loading ? 'Adding...' : 'Add Subcategory'}
        </button>
        
        {error && <div className="alert alert-danger-i mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default AddSubcategory;

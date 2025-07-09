import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Inventory.css';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newCategory = { categoryName };
      await axios.post('http://localhost:5000/api/category/add', newCategory);
      setCategoryName('');
      alert('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-i mt-4">
      <div className='form-title-i'>
        <span className='form-icon-i'><FontAwesomeIcon icon={faFolderPlus} /></span> Add New Category
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group-i">
          <input
            type="text"
            className="form-control"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary-i" disabled={loading}>
          {loading ? 'Adding...' : 'Add Category'}
        </button>
        {error && <div className="alert alert-danger-i mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default AddCategory;

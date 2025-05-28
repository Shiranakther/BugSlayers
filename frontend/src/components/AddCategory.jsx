import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Inventory.css';

const AddCategoryAndSubcategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/category');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newSubCategory.trim()) {
      setError('Please enter a subcategory name.');
      return;
    }

    if (!selectedCategoryId && !newCategoryName.trim()) {
      setError('Please select an existing category or enter a new category.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (newCategoryName.trim()) {
        // Add new category
        await axios.post('http://localhost:5000/api/category/add', {
          categoryName: newCategoryName.trim(),
        });
        setSuccess('New category added successfully!');
      } else if (selectedCategoryId) {
        // Add subcategory to existing category
        await axios.post(
          `http://localhost:5000/api/category/${selectedCategoryId}/subcategory`,
          { subcategoryName: newSubCategory.trim() }
        );
        setSuccess('Subcategory added successfully!');
      }

      // Refresh categories list after successful add
      const res = await axios.get('http://localhost:5000/api/category');
      setCategories(res.data);

      // Clear form inputs
      setNewCategoryName('');
      setSelectedCategoryId('');
      setNewSubCategory('');
    } catch (err) {
      console.error('Error saving category/subcategory:', err);
      setError('Failed to save category/subcategory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-i mt-4">
      <div className="form-title-i">
        <span className="form-icon-i">
          <FontAwesomeIcon icon={faFolderPlus} />
        </span>{' '}
        Add Category & Subcategory
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 row align-items-center">
          <label className="col-sm-4 col-form-label">
            Select Existing Category (optional)
          </label>
          <div className="col-sm-8">
            <select
              className="form-select"
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setNewCategoryName('');
              }}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3 row align-items-center">
          <label className="col-sm-4 col-form-label">Or Enter New Category</label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control"
              placeholder="New Category Name"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setSelectedCategoryId('');
              }}
            />
          </div>
        </div>

        <div className="mb-3 row align-items-center">
          <label className="col-sm-4 col-form-label">Subcategory Name</label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control"
              placeholder="New Subcategory Name"
              value={newSubCategory}
              onChange={(e) => setNewSubCategory(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 text-center">
            <button type="submit" className="btn btn-primary-i" disabled={loading}>
              {loading ? (
                'Saving...'
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} /> Save Category & Subcategory
                </>
              )}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger-i mt-3">{error}</div>}
        {success && <div className="alert alert-success-i mt-3">{success}</div>}
      </form>
    </div>
  );
};

export default AddCategoryAndSubcategory;

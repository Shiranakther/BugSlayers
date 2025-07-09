import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsProgress, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Inventory.css';

const ManageCategory = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [search, setSearch] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/category/with-subcategories');
      setCategoryData(response.data.reverse()); // reverse to show latest first
    } catch (err) {
      setError('Error fetching category data');
      console.error('Error fetching category data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/category/${id}`);
      fetchCategoryData();
      alert('Category deleted successfully!');
    } catch (err) {
      setError('Error deleting category');
      console.error('Error deleting category:', err);
    }
  };

  const handleEdit = (category) => {
    setEditCategory({ ...category });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editCategory || !editCategory._id) {
      setError("Invalid category selected for update.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/category/${editCategory._id}`, {
        categoryName: editCategory.categoryName,
        subcategories: editCategory.subcategories
      });


      fetchCategoryData();
      setEditCategory(null);
      alert('Category updated successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error updating category';
      setError(errorMessage);
      console.error('Error updating category:', err);
    }
  };

  const filteredCategories = categoryData.filter((cat) =>
    cat.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid mt-4 inventory-container">
      <div className='inventory-title'>
        <span className='inventory-title-icon'><FontAwesomeIcon icon={faBarsProgress} /></span> Manage Category & Subcategory
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive inventory-table-container">
        {loading ? (
          <div>Loading...</div>
        ) : filteredCategories.length === 0 ? (
          <div className='no-items'>No items found</div>
        ) : (
          <table className="table table-striped table-bordered inventory-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Subcategories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat, index) => (
                <tr key={cat._id}>
                  <td>{index + 1}</td>
                  <td>{cat.categoryName}</td>
                  <td>
                    {cat.subcategories.length > 0 ? (
                      <ul className="mb-0 ps-3">
                        {cat.subcategories.map((sub) => (
                          <li key={sub._id}>{sub.subcategoryName}</li>
                        ))}
                      </ul>
                    ) : (
                      <em>No subcategories</em>
                    )}
                  </td>
                  <td>
                    <span className='inventory-edit-icon' onClick={() => handleEdit(cat)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                    <span className='inventory-delete-icon' onClick={() => handleDelete(cat._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editCategory && (
        <div className="inventory-form-container mt-4">
          <span className="form-icon-i"><FontAwesomeIcon icon={faEdit} /></span> Update Category
          <form onSubmit={handleUpdate}>
  <div className="mb-3">
    <label className="form-label">Category Name</label>
    <input
      type="text"
      className="form-control"
      value={editCategory.categoryName}
      onChange={(e) =>
        setEditCategory((prev) => ({
          ...prev,
          categoryName: e.target.value,
        }))
      }
      required
    />
  </div>

  <div className="mb-3">
    <label className="form-label">Subcategories</label>
    {editCategory.subcategories?.length > 0 ? (
      editCategory.subcategories.map((sub, index) => (
        <input
          key={sub._id}
          type="text"
          className="form-control mb-2"
          value={sub.subcategoryName}
          onChange={(e) => {
            const updatedSubs = [...editCategory.subcategories];
            updatedSubs[index].subcategoryName = e.target.value;
            setEditCategory((prev) => ({
              ...prev,
              subcategories: updatedSubs,
            }));
          }}
          required
        />
      ))
    ) : (
      <div>No subcategories</div>
    )}
  </div>

            <div className="inventory-row">
              <button type="submit" className="btn btn-success">Update</button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => setEditCategory(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageCategory;

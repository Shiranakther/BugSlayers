import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsProgress, faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import '../Inventory.css';

const ManageInventories = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newImage, setNewImage] = useState(null); // for updating image

  useEffect(() => {
    fetchItems();
    fetchCategories(); 
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/inventory');
      setItems(Array.isArray(response.data) ? response.data.reverse() : []);
    } catch (err) {
      setError('Error fetching inventory items');
      console.error('Error fetching inventory items:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/category');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.categoryName : 'Unknown';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      alert('Item deleted successfully!');
    } catch (err) {
      setError('Error deleting item');
      console.error('Error deleting item:', err);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setNewImage(null); // Reset image
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productName', editItem.productName);
    formData.append('category', editItem.category);
    formData.append('quantity', Number(editItem.quantity));
    formData.append('buyingPrice', parseFloat(editItem.buyingPrice).toFixed(2));
    formData.append('sellingPrice', parseFloat(editItem.sellingPrice).toFixed(2));
    formData.append('dateAdded', editItem.dateAdded);
    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      await axios.put(`http://localhost:5000/api/inventory/${editItem._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchItems(); // Refresh items
      setEditItem(null);
      alert('Item updated successfully!');
    } catch (err) {
      setError('Error updating item');
      console.error('Error updating item:', err);
    }
  };

  const filteredItems = items.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid mt-4 inventory-container">
      <div className='inventory-title'>
        <span className='inventory-title-icon'><FontAwesomeIcon icon={faBarsProgress} /></span> Manage Inventory
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive inventory-table-container">
          {loading ? (
            <div>Loading...</div>
          ) : filteredItems.length === 0 ? (
            <div className='no-items'>No items found</div>
          ) : (
            <table className="table table-striped table-bordered inventory-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Product Code</th>
                  <th>Quantity</th>
                  <th>Buying Price</th>
                  <th>Selling Price</th>
                  <th>Date Added</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.productName}</td>
                    <td>{getCategoryName(item.category)}</td>
                    <td>{item.code || 'N/A'}</td>
                    <td>{item.quantity}</td>
                    <td>{parseFloat(item.buyingPrice).toFixed(2)}</td>
                    <td>{parseFloat(item.sellingPrice).toFixed(2)}</td>
                    <td>{item.dateAdded ? new Date(item.dateAdded).toLocaleDateString() : 'N/A'}</td>
                    
                    <td>{item.image ? item.image : 'No image'}</td>

                    <td>
                      <span className='inventory-edit-icon' onClick={() => handleEdit(item)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                      <span className='inventory-delete-icon' onClick={() => handleDelete(item._id)}>
                        <FontAwesomeIcon icon={faRemove} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editItem && (
        <div className="inventory-form-container edit-form mt-4">
          <span className="form-icon-i"><FontAwesomeIcon icon={faEdit} /></span>Update Product
          <form onSubmit={handleUpdate}>
            <div className="inventory-row">
              <label className="inventory-form-label">Product Name</label>
              <input
                type="text"
                className="inventory-form-control"
                value={editItem.productName}
                onChange={(e) =>
                  setEditItem({ ...editItem, productName: e.target.value })
                }
                required
              />
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Category</label>
              <select
                className="inventory-form-control"
                value={editItem.category}
                onChange={(e) =>
                  setEditItem({ ...editItem, category: e.target.value })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                ))}
              </select>
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Quantity</label>
              <input
                type="number"
                className="inventory-form-control"
                value={editItem.quantity}
                onChange={(e) =>
                  setEditItem({ ...editItem, quantity: Number(e.target.value) })
                }
                required
              />
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Buying Price</label>
              <input
                type="number"
                className="inventory-form-control"
                min="0"
                step="0.01"
                value={editItem.buyingPrice.toFixed(2)}
                onChange={(e) => setEditItem({ ...editItem, buyingPrice: Number(e.target.value) })}
                required
              />
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Selling Price</label>
              <input
                type="number"
                className="inventory-form-control"
                value={editItem.sellingPrice}
                onChange={(e) => setEditItem({ ...editItem, sellingPrice: Number(e.target.value) })}
                required
              />
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Date Added</label>
              <input
                type="date"
                className="inventory-form-control"
                value={editItem.dateAdded ? editItem.dateAdded.substring(0, 10) : ''}
                onChange={(e) => setEditItem({ ...editItem, dateAdded: e.target.value })}
                required
              />
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Update Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                className="inventory-form-control"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
            </div>

            <div className="inventory-row">
            <button type="submit" className="btn btn-success">Update Item</button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => setEditItem(null)}
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

export default ManageInventories;

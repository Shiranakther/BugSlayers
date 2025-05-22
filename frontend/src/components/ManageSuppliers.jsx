
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsProgress, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './Supplier.css';

const ManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [dateFilter] = useState('');
  const [showTable, setShowTable] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/api/suppliers', {
        params: { search, filter, date: dateFilter }
      });
      // Sort suppliers by date in ascending order
      const sortedSuppliers = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setSuppliers(sortedSuppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (showTable) {
      fetchSuppliers();
    }
  }, [showTable, search, filter, dateFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;

    try {
      await axios.delete(`/api/suppliers/${id}`); // Fixed API URL
      setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier._id !== id));
      alert('Supplier deleted successfully!');
    } catch (error) {
      console.error('Error deleting supplier:', error.response ? error.response.data : error.message);
      alert('Failed to delete supplier. Please try again.');
    }
  };

  return (
    <div className="container-fluid mt-5 supplier-container">
      <div className='supplier-title'>
        <span className='supplier-title-icon'><FontAwesomeIcon icon={faBarsProgress} /></span> Manage Supplier
      </div>

      <div className="card p-3 mb-3">
        <div className="mb-3">
          <input
            type="text"
            className="form-control-i"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control-i"
            placeholder="Filter by products..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="table-responsive supplier-table-container">
          <button className="btn btn-info" onClick={() => setShowTable(!showTable)}>
            {showTable ? 'Hide Table' : 'View Table'}
          </button>
        </div>
      </div>

      {showTable && suppliers.length > 0 ? (
        <table className="table table-striped table-bordered supplier-table">
          <thead className="table-white">
            <tr>
              <th>Date</th>
              <th>Supplier Name</th>
              <th>Phone1</th>
              <th>Phone2</th>
              <th>Fax</th>
              <th>Email</th>
              <th>Address</th>
              <th>Supply Products</th>
              <th>Payment Terms</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier._id}>
                <td>{new Date(supplier.date).toLocaleDateString()}</td>
                <td>{supplier.supplierName}</td>
                <td>{supplier.phone1}</td>
                <td>{supplier.phone2 || '-'}</td>
                <td>{supplier.fax || '-'}</td>
                <td>{supplier.email || '-'}</td>
                <td>{supplier.address}</td>
                <td>{supplier.supplyProducts}</td>
                <td>{supplier.paymentTerms}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Link to={`/dashboard/suppliers/edit/${supplier._id}`} className="btn btn-warning">
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(supplier._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : showTable ? (
        <div className="alert alert-warning text-center">No suppliers found</div>
      ) : null}
    </div>
  );
};

export default ManageSuppliers;

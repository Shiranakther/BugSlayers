import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faEdit as faEditIcon,
} from "@fortawesome/free-solid-svg-icons";
import "./Supplier.css";

const ManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    supplierName: "",
    phone1: "",
    phone2: "",
    fax: "",
    email: "",
    address: "",
    paymentTerms: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/suppliers");
      setSuppliers(response.data.reverse());
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      alert("Failed to fetch suppliers");
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    return (supplier.supplierName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?"))
      return;
    try {
      await axios.delete(`/api/suppliers/${id}`);
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Failed to delete supplier");
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier._id);
    setFormData({
      supplierName: supplier.supplierName || "",
      phone1: supplier.phone1 || "",
      phone2: supplier.phone2 || "",
      fax: supplier.fax || "",
      email: supplier.email || "",
      address: supplier.address || "",
      paymentTerms: supplier.paymentTerms || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/suppliers/${editingSupplier}`, formData);
      setEditingSupplier(null);
      setFormData({
        supplierName: "",
        phone1: "",
        phone2: "",
        fax: "",
        email: "",
        address: "",
        paymentTerms: "",
      });
      fetchSuppliers();
      alert("Supplier updated successfully!");
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert("Failed to update supplier");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container1">
      <h4 className="manage-title">
        <FontAwesomeIcon icon={faTruck} className="cus-icon" /> Manage Suppliers
      </h4>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
      />

      {loading ? (
        <p>Loading suppliers...</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone 1</th>
              <th>Phone 2</th>
              <th>Fax</th>
              <th>Email</th>
              <th>Address</th>
              <th>Payment Terms</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier._id}>
                  <td>{supplier.supplierName || "-"}</td>
                  <td>{supplier.phone1 || "-"}</td>
                  <td>{supplier.phone2 || "-"}</td>
                  <td>{supplier.fax || "-"}</td>
                  <td>{supplier.email || "-"}</td>
                  <td>{supplier.address || "-"}</td>
                  <td>{supplier.paymentTerms || "-"}</td>
                  <td>
                    <button
                      className="btn1"
                      onClick={() => handleEdit(supplier)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn2"
                      onClick={() => handleDelete(supplier._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-danger">
                  No Matching Supplier Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {editingSupplier && (
        <div className="edit-form-container">
          <form onSubmit={handleUpdate} className="form">
            <h4 className="form-title mb-4 text-lg font-semibold">
              <FontAwesomeIcon icon={faEditIcon} /> Edit Supplier
            </h4>

            {/* Two-column layout */}
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type={key === "email" ? "email" : "text"}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    required={key === "supplierName" || key === "email"}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="submit"
                className="btnUpdate px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditingSupplier(null)}
                className="btnClose px-5 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
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

export default ManageSuppliers;

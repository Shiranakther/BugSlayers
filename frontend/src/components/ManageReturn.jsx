import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageReturn = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [returns, setReturns] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    returnId: "",
    companyName: "",
    date: "",
    category: "",
    subcategory: "",
    product: "",
    quantity: "",
    productPrice: "",
    status: "",
    note: "",
  });

  const fetchReturns = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/returns`);
      setReturns(res.data);
    } catch (err) {
      console.error("Failed to fetch returns:", err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/suppliers`);
      setSuppliers(res.data);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/category`);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchReturns();
    fetchSuppliers();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (form.category) {
      axios
        .get(`${BASE_URL}/api/subcategories/by-category/${form.category}`)
        .then((res) => setSubcategories(res.data))
        .catch((err) => console.error("Error fetching subcategories:", err));
    } else {
      setSubcategories([]);
    }
  }, [form.category]);

  useEffect(() => {
    if (!editingId) {
      setForm((prev) => ({ ...prev, returnId: generateNextReturnId() }));
    }
  }, [returns, editingId]);

  const generateNextReturnId = () => {
    if (editingId) return form.returnId;
    if (returns.length === 0) return "RET-001";
    const numbers = returns.map((r) =>
      parseInt(r.returnId?.split("-")[1] || "0", 10)
    );
    const maxNumber = Math.max(...numbers);
    return `RET-${(maxNumber + 1).toString().padStart(3, "0")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "productPrice" || name === "quantity") &&
      value !== "" &&
      !/^\d*\.?\d*$/.test(value)
    )
      return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = (price, qty) => {
    const p = parseFloat(price);
    const q = parseFloat(qty);
    return isNaN(p) || isNaN(q) ? 0 : p * q;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "returnId",
      "companyName",
      "date",
      "category",
      "subcategory",
      "product",
      "quantity",
      "productPrice",
      "status",
    ];
    for (const field of requiredFields) {
      if (!form[field]) {
        setMessage("Please fill all required fields.");
        return;
      }
    }

    const payload = {
      ...form,
      quantity: Number(form.quantity),
      productPrice: Number(form.productPrice),
      totalReturnPrice: calculateTotal(form.productPrice, form.quantity),
    };

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/returns/${editingId}`, payload);
        setMessage("Return updated successfully.");
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/api/returns`, payload);
        setMessage("Return added successfully.");
      }

      setForm({
        returnId: generateNextReturnId(),
        companyName: "",
        date: "",
        category: "",
        subcategory: "",
        product: "",
        quantity: "",
        productPrice: "",
        status: "",
        note: "",
      });

      fetchReturns();
    } catch (err) {
      console.error("Save error:", err);
      setMessage("Failed to save return.");
    }
  };

  const handleEdit = (ret) => {
    setEditingId(ret._id);
    setForm({
      returnId: ret.returnId,
      companyName: ret.companyName,
      date: ret.date?.split("T")[0] || "",
      category: ret.category,
      subcategory: ret.subcategory,
      product: ret.product,
      quantity: ret.quantity?.toString() || "",
      productPrice: ret.productPrice?.toString() || "",
      status: ret.status,
      note: ret.note || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this return?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/returns/${id}`);
      setMessage("Return deleted.");
      fetchReturns();
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("Failed to delete return.");
    }
  };

  return (
    <div className="container1">
      <h4 className="manage-title">Manage Returns</h4>
      {message && (
        <div className="alert alert-info" style={{ marginBottom: "20px" }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          {/* Return ID */}
          <div className="flex flex-col">
            <label>Return ID</label>
            <input
              type="text"
              name="returnId"
              value={form.returnId}
              disabled
              className="border border-gray-300 bg-gray-100 px-3 py-2 rounded-md cursor-not-allowed"
            />
          </div>

          {/* Supplier */}
          <div className="flex flex-col">
            <label>Supplier</label>
            <select
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              required
              className="border border-gray-300 px-3 py-2 rounded-md"
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s.supplierName}>
                  {s.supplierName}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md"
              required
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div className="flex flex-col">
            <label>Subcategory</label>
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md"
              required
            >
              <option value="">-- Select Subcategory --</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.subcategoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div className="flex flex-col">
            <label>Product</label>
            <input
              type="text"
              name="product"
              value={form.product}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md"
              placeholder="Product"
              required
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min="1"
              className="border border-gray-300 px-3 py-2 rounded-md"
              placeholder="Quantity"
              required
            />
          </div>

          {/* Product Price */}
          <div className="flex flex-col">
            <label>Product Price (Rs.)</label>
            <input
              type="text"
              name="productPrice"
              value={form.productPrice}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md"
              placeholder="Price"
              required
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md"
              required
            >
              <option value="">-- Select Status --</option>
              <option value="Pending">Pending</option>
              <option value="Returned">Returned</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>

          {/* Note */}
          <div className="flex flex-col col-span-2">
            <label>Note</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows="3"
              className="border border-gray-300 px-3 py-2 rounded-md"
              placeholder="Optional note..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="submit"
            className="btnUpdate px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            {editingId ? "Update Return" : "Add Return"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btnClose px-5 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
              onClick={() => {
                setEditingId(null);
                setForm({
                  returnId: generateNextReturnId(),
                  companyName: "",
                  date: "",
                  category: "",
                  subcategory: "",
                  product: "",
                  quantity: "",
                  productPrice: "",
                  status: "",
                  note: "",
                });
                setMessage("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="table table-striped mt-6">
        <thead>
          <tr>
            <th>Return ID</th>
            <th>Supplier</th>
            <th>Date</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            <th>Status</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {returns.length > 0 ? (
            returns.map((ret) => (
              <tr key={ret._id}>
                <td>{ret.returnId}</td>
                <td>{ret.companyName}</td>
                <td>{new Date(ret.date).toLocaleDateString()}</td>
                <td>{ret.category}</td>
                <td>{ret.subcategory}</td>
                <td>{ret.product}</td>
                <td>{ret.quantity}</td>
                <td>{ret.productPrice?.toFixed(2)}</td>
                <td>{ret.totalReturnPrice?.toFixed(2)}</td>
                <td>{ret.status}</td>
                <td>{ret.note || "-"}</td>
                <td>
                  <button
                    className="btn1 me-2"
                    onClick={() => handleEdit(ret)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn2"
                    onClick={() => handleDelete(ret._id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="text-center text-danger">
                No return records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageReturn;

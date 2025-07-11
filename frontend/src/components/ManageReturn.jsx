import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageReturn = () => {
  const [returns, setReturns] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    returnId: "",
    companyName: "",
    date: "",
    product: "",
    quantity: "",
    productPrice: "",
    status: "",
    note: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Fetch all returns
  const fetchReturns = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/returns`);
      setReturns(res.data);
    } catch (err) {
      console.error("Failed to fetch returns:", err);
    }
  };

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/suppliers`);
      setSuppliers(res.data);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    }
  };

  // Generate next Return ID like RET-001, RET-002, ...
  const generateNextReturnId = () => {
    if (editingId) {
      // If editing, keep existing returnId
      return form.returnId;
    }

    if (returns.length === 0) return "RET-001";

    // Extract numbers from all returnIds, get max number
    const numbers = returns.map((r) => {
      const parts = r.returnId?.split("-");
      return parts && parts.length === 2 ? parseInt(parts[1], 10) : 0;
    });

    const maxNumber = Math.max(...numbers);
    const nextNumber = maxNumber + 1;

    return `RET-${nextNumber.toString().padStart(3, "0")}`;
  };

  // Set returnId automatically when returns list or editingId changes
  React.useEffect(() => {
    if (!editingId) {
      setForm((prev) => ({ ...prev, returnId: generateNextReturnId() }));
    }
  }, [returns, editingId]); // run when returns or editingId changes

  useEffect(() => {
    fetchReturns();
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "productPrice" || name === "quantity") && value !== "") {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = (price, qty) => {
    const p = parseFloat(price);
    const q = parseFloat(qty);
    if (isNaN(p) || isNaN(q)) return 0;
    return p * q;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.returnId.trim() ||
      !form.companyName ||
      !form.date ||
      !form.product ||
      !form.quantity ||
      !form.productPrice ||
      !form.status
    ) {
      setMessage("Please fill all required fields.");
      return;
    }

    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        productPrice: Number(form.productPrice),
        totalReturnPrice: calculateTotal(form.productPrice, form.quantity),
      };

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
        product: "",
        quantity: "",
        productPrice: "",
        status: "",
        note: "",
      });

      fetchReturns();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Failed to save return.");
      }
      console.error("Save error:", err);
    }
  };

  const handleEdit = (ret) => {
    setEditingId(ret._id);
    setForm({
      returnId: ret.returnId,
      companyName: ret.companyName,
      date: ret.date ? ret.date.split("T")[0] : "",
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
      setMessage("Failed to delete return.");
      console.error("Delete error:", err);
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
            <label htmlFor="returnId" className="text-sm font-medium mb-1">
              Return ID
            </label>
            <input
              type="text"
              id="returnId"
              name="returnId"
              value={form.returnId}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
              disabled={true} // always disabled, auto-generated
            />
          </div>

          {/* Supplier */}
          <div className="flex flex-col">
            <label htmlFor="companyName" className="text-sm font-medium mb-1">
              Supplier
            </label>
            <select
              id="companyName"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier.supplierName}>
                  {supplier.supplierName}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label htmlFor="date" className="text-sm font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col">
            <label htmlFor="quantity" className="text-sm font-medium mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min={1}
              required
              className="border border-gray-300 rounded-md px-3 py-2"
              placeholder="Quantity"
            />
          </div>

          {/* Product */}
          <div className="flex flex-col">
            <label htmlFor="product" className="text-sm font-medium mb-1">
              Product
            </label>
            <input
              type="text"
              id="product"
              name="product"
              value={form.product}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2"
              placeholder="Product"
            />
          </div>

          {/* Product Price */}
          <div className="flex flex-col">
            <label htmlFor="productPrice" className="text-sm font-medium mb-1">
              Product Price (Rs.)
            </label>
            <input
              type="text"
              id="productPrice"
              name="productPrice"
              value={form.productPrice}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2"
              placeholder="Product Price"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="status" className="text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">-- Select Status --</option>
              <option value="Pending">Pending</option>
              <option value="Returned">Returned</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>

          {/* Note */}
          <div className="flex flex-col col-span-2">
            <label htmlFor="note" className="text-sm font-medium mb-1">
              Note
            </label>
            <textarea
              id="note"
              name="note"
              value={form.note}
              onChange={handleChange}
              rows="3"
              placeholder="Enter return note (optional)"
              className="border border-gray-300 rounded-md px-3 py-2"
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

      {/* Returns Table */}
      <table className="table table-striped mt-6">
        <thead>
          <tr>
            <th>Return ID</th>
            <th>Supplier</th>
            <th>Date</th>
            <th>Quantity</th>
            <th>Product</th>
            <th>Product Price (Rs.)</th>
            <th>Total Return Price (Rs.)</th>
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
                <td>{ret.quantity}</td>
                <td>{ret.product}</td>
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
              <td colSpan="10" className="text-center text-danger">
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
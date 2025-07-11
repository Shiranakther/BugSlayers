import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [returns, setReturns] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    returnId: "",
    companyName: "",
    returnDate: "",
    refundDate: "",
    status: "Not Refund",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Fetch all refunds
  const fetchRefunds = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/refunds`);
      setRefunds(res.data);
    } catch (err) {
      console.error("Failed to fetch refunds:", err);
      setMessage("Failed to fetch refunds.");
    }
  };

  // Fetch returns for dropdown
  const fetchReturns = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/returns`);
      setReturns(res.data);
    } catch (err) {
      console.error("Failed to fetch returns:", err);
      setMessage("Failed to fetch returns.");
    }
  };

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/suppliers`);
      setSuppliers(res.data);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      setMessage("Failed to fetch suppliers.");
    }
  };

  // Generate next Refund ID like REF-001, REF-002, ...
  const generateNextRefundId = () => {
    if (editingId) {
      return form.returnId;
    }

    if (refunds.length === 0) return "REF-001";

    const numbers = refunds.map((r) => {
      const parts = r.returnId?.split("-");
      return parts && parts.length === 2 ? parseInt(parts[1], 10) : 0;
    });

    const maxNumber = Math.max(...numbers);
    const nextNumber = maxNumber + 1;

    return `REF-${nextNumber.toString().padStart(3, "0")}`;
  };

  // Set returnId automatically when refunds list or editingId changes
  useEffect(() => {
    if (!editingId) {
      setForm((prev) => ({ ...prev, returnId: generateNextRefundId() }));
    }
  }, [refunds, editingId]);

  // Initial fetch
  useEffect(() => {
    fetchRefunds();
    fetchReturns();
    fetchSuppliers();
  }, []);

  // When returnId changes, auto-fill companyName and returnDate from returns list
  useEffect(() => {
    if (!form.returnId) {
      setForm((prev) => ({
        ...prev,
        companyName: "",
        returnDate: "",
        refundDate: form.status === "Refund" ? form.refundDate : "",
      }));
      return;
    }

    const selectedReturn = returns.find((r) => r.returnId === form.returnId);
    if (selectedReturn) {
      setForm((prev) => ({
        ...prev,
        companyName: selectedReturn.companyName,
        returnDate: selectedReturn.date ? selectedReturn.date.split("T")[0] : "",
        // refundDate remains as is
      }));
    }
  }, [form.returnId, returns]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For status, update refundDate accordingly
    if (name === "status") {
      if (value === "Refund") {
        setForm((prev) => ({
          ...prev,
          status: value,
          refundDate: new Date().toISOString().split("T")[0],
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          status: value,
          refundDate: "",
        }));
      }
      return;
    }

    // For returnId change, just update the returnId (the useEffect will handle autofill)
    if (name === "returnId") {
      setForm((prev) => ({ ...prev, returnId: value }));
      return;
    }

    // Prevent user editing companyName manually (optional: make supplier readonly or dropdown disabled)
    if (name === "companyName") {
      setForm((prev) => ({ ...prev, companyName: value }));
      return;
    }

    // Otherwise update normally
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate required fields
    if (!form.returnId || !form.companyName || !form.returnDate || !form.status) {
      setMessage("Please fill all required fields.");
      return;
    }

    // Validate returnId exists in returns
    const returnExists = returns.find((r) => r.returnId === form.returnId);
    if (!returnExists) {
      setMessage("Selected return ID does not exist.");
      return;
    }

    // Validate companyName matches return
    if (returnExists.companyName !== form.companyName) {
      setMessage("Supplier does not match the return's supplier.");
      return;
    }

    // Check for duplicate returnId
    if (!editingId && refunds.some((r) => r.returnId === form.returnId)) {
      setMessage("This return ID is already used in a refund.");
      return;
    }

    // Validate dates
    if (isNaN(new Date(form.returnDate).getTime())) {
      setMessage("Invalid return date.");
      return;
    }
    if (form.status === "Refund" && (!form.refundDate || isNaN(new Date(form.refundDate).getTime()))) {
      setMessage("Invalid refund date.");
      return;
    }

    try {
      const payload = {
        ...form,
        returnDate: new Date(form.returnDate).toISOString(),
        refundDate: form.status === "Refund" ? new Date(form.refundDate).toISOString() : null,
      };

      if (editingId) {
        await axios.put(`${BASE_URL}/api/refunds/${editingId}`, payload);
        setMessage("Refund updated successfully.");
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/api/refunds`, payload);
        setMessage("Refund added successfully.");
      }

      setForm({
        returnId: generateNextRefundId(),
        companyName: "",
        returnDate: "",
        refundDate: "",
        status: "Not Refund",
      });

      fetchRefunds();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save refund.");
      console.error("Save refund error:", err.response?.data);
    }
  };

  const handleEdit = (refund) => {
    setEditingId(refund._id);
    setForm({
      returnId: refund.returnId,
      companyName: refund.companyName,
      returnDate: refund.returnDate ? refund.returnDate.split("T")[0] : "",
      refundDate: refund.refundDate ? refund.refundDate.split("T")[0] : "",
      status: refund.status,
    });
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this refund?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/refunds/${id}`);
      setMessage("Refund deleted.");
      fetchRefunds();
    } catch (err) {
      setMessage("Failed to delete refund.");
      console.error("Delete refund error:", err);
    }
  };

  return (
    <div className="container1">
      <h4 className="manage-title">Manage Refunds</h4>

      {message && (
        <div className="alert alert-info" style={{ marginBottom: "20px" }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="returnId" className="text-sm font-medium mb-1">
              Return ID
            </label>
            <select
              id="returnId"
              name="returnId"
              value={form.returnId}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">-- Select Return ID --</option>
              {returns.map((ret) => (
                <option key={ret._id} value={ret.returnId}>
                  {ret.returnId}
                </option>
              ))}
            </select>
          </div>

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

          <div className="flex flex-col">
            <label htmlFor="returnDate" className="text-sm font-medium mb-1">
              Return Date
            </label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={form.returnDate}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

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
              <option value="Refund">Refund</option>
              <option value="Not Refund">Not Refund</option>
            </select>
          </div>

          {form.status === "Refund" && (
            <div className="flex flex-col">
              <label htmlFor="refundDate" className="text-sm font-medium mb-1">
                Refund Date
              </label>
              <input
                type="date"
                id="refundDate"
                name="refundDate"
                value={form.refundDate}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="submit"
            className="btnUpdate px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            {editingId ? "Update Refund" : "Add Refund"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btnClose px-5 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
              onClick={() => {
                setEditingId(null);
                setForm({
                  returnId: generateNextRefundId(),
                  companyName: "",
                  returnDate: "",
                  refundDate: "",
                  status: "Not Refund",
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
            <th>Return Date</th>
            <th>Status</th>
            <th>Refund Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {refunds.length > 0 ? (
            refunds.map((refund) => (
              <tr key={refund._id}>
                <td>{refund.returnId}</td>
                <td>{refund.companyName}</td>
                <td>{new Date(refund.returnDate).toLocaleDateString()}</td>
                <td>{refund.status}</td>
                <td>
                  {refund.status === "Refund" && refund.refundDate
                    ? new Date(refund.refundDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <button
                    className="btn1 me-2"
                    onClick={() => handleEdit(refund)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn2"
                    onClick={() => handleDelete(refund._id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-danger">
                No refund records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageRefunds;

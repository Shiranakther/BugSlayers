import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./AddSupplier.css";

const AddSupplier = ({ onSupplierSelected }) => {
  const [existingSuppliers, setExistingSuppliers] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [supplier, setSupplier] = useState({
    date: new Date().toISOString().split("T")[0],
    supplierName: "",
    phone1: "",
    phone2: "",
    fax: "",
    email: "",
    address: "",
    supplyProducts: [],
    paymentTerms: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchExistingSuppliers();
  }, []);

  const fetchExistingSuppliers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/api/suppliers/");
      setExistingSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const validateFields = (name, value) => {
    let error = "";

    // Clean non-digits from phone and fax fields and limit length to 10
    if (["phone1", "phone2", "fax"].includes(name)) {
      // Remove non-digit chars
      value = value.replace(/\D/g, "");

      // Limit to 10 digits max with alert
      if (value.length > 10) {
        alert(`${name === "fax" ? "Fax" : "Phone"} number must not exceed 10 digits`);
        value = value.slice(0, 10);
      }

      // Validate exactly 10 digits only
      if (value && !validatePhoneNumber(value)) {
        error = "Must be exactly 10 digits and numeric";
      }

      // Check phone1 and phone2 not same
      if (name === "phone2" && value === supplier.phone1) {
        error = "Primary and Secondary Contact Numbers must not be the same";
      }
    }

    if (name === "email" && value) {
      if (!validateEmail(value)) {
        error = "Email must be a valid @gmail.com address";
      }
    }

    if (name === "address" && !value.trim()) {
      error = "Address cannot be empty";
    }

    if (name === "supplierName" && !value.trim()) {
      error = "Supplier Name cannot be empty";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return value;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validatedValue = validateFields(name, value);
    setSupplier((prev) => ({ ...prev, [name]: validatedValue }));
  };

  const handleSupplierNameBlur = (e) => {
    const value = e.target.value;
    if (value) validateFields("supplierName", value);
  };

  const handleSearchSupplier = async () => {
    if (!searchName.trim()) {
      alert("Please enter a supplier name to search");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/suppliers/", {
        params: { search: searchName },
      });

      if (response.data.length > 0) {
        alert("Supplier already exists!");
        setShowAddButton(false);
        setShowForm(false);
        setIsAddingNew(false);
        setSupplier({
          date: new Date().toISOString().split("T")[0],
          supplierName: "",
          phone1: "",
          phone2: "",
          fax: "",
          email: "",
          address: "",
          supplyProducts: [],
          paymentTerms: "",
        });
      } else {
        alert("No supplier found with this name. You can add a new supplier.");
        setShowAddButton(true);
        setShowForm(false);
        setIsAddingNew(false);
      }
    } catch (error) {
      console.error("Error searching suppliers:", error);
      alert("Error searching for supplier. Please try again.");
    }
  };

  const handleAddNewSupplier = () => {
    setIsAddingNew(true);
    setShowForm(true);
    setShowAddButton(false);
    setSupplier({
      date: new Date().toISOString().split("T")[0],
      supplierName: searchName,
      phone1: "",
      phone2: "",
      fax: "",
      email: "",
      address: "",
      supplyProducts: [],
      paymentTerms: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAddingNew) {
      alert("Please search for a supplier or add a new one");
      return;
    }

    // Validate all fields again before submit
    let hasErrors = false;
    const validatedSupplier = {};
    Object.entries(supplier).forEach(([key, value]) => {
      if (key !== "supplyProducts") {
        const validatedValue = validateFields(key, value);
        validatedSupplier[key] = validatedValue;
        if (errors[key]) hasErrors = true;
      }
    });

    if (Object.values(errors).some((err) => err) || hasErrors) {
      alert("Please fix the validation errors.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/suppliers/add",
        supplier
      );

      alert(response.data.message || "Supplier added successfully");

      setSupplier({
        date: new Date().toISOString().split("T")[0],
        supplierName: "",
        phone1: "",
        phone2: "",
        fax: "",
        email: "",
        address: "",
        supplyProducts: [],
        paymentTerms: "",
      });

      setErrors({});
      setIsAddingNew(false);
      setShowForm(false);
      setShowAddButton(false);
      setSearchName("");
      fetchExistingSuppliers();
    } catch (error) {
      console.error("Error adding supplier:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
        if (error.response.data.message.includes("already exists")) {
          setShowAddButton(false);
          setShowForm(false);
        }
      } else {
        alert("Failed to add supplier. Please try again.");
      }
    }
  };

  return (
    <div className="container-i form-container-i">
      <div className="text-center">Supplier Management System</div>

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group-i">
          <label htmlFor="searchName">Search Supplier Name:</label>
          <div style={{ display: "flex", gap: "10px", flex: "1" }}>
            <input
              type="text"
              className="form-control"
              id="searchName"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter supplier name"
            />
            <button
              type="button"
              onClick={handleSearchSupplier}
              className="btn btn-primary-i"
            >
              Check
            </button>
          </div>
        </div>

        {showAddButton && (
          <div className="form-group-i add-button-container">
            <button
              type="button"
              onClick={handleAddNewSupplier}
              className="btn btn-primary-i"
            >
              <FontAwesomeIcon icon={faSquarePlus} className="mr-2" />
              Add New Supplier
            </button>
          </div>
        )}

        {showForm && isAddingNew && (
          <div className="add-supplier-form">
            <div className="form-group-i">
              <h5>Add New Supplier Details</h5>
            </div>

            <div className="form-grid">
              <div className="form-group-i">
                <label>Date:</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={supplier.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {[
                { label: "Supplier Name", key: "supplierName", required: true },
                { label: "Contact Number (Primary)", key: "phone1", required: true },
                { label: "Contact Number (Secondary)", key: "phone2" },
                { label: "Fax Number", key: "fax" },
                { label: "Email Address", key: "email" },
                { label: "Address", key: "address" },
              ].map((field) => (
                <div key={field.key} className="form-group-i">
                  <label>{field.label}:</label>
                  <input
                    type="text"
                    className="form-control"
                    name={field.key}
                    value={supplier[field.key]}
                    onChange={handleInputChange}
                    placeholder={field.label}
                    required={field.required || false}
                    onBlur={(e) => {
                      if (field.key === "supplierName") handleSupplierNameBlur(e);
                    }}
                  />
                  {errors[field.key] && (
                    <div className="error-message">{errors[field.key]}</div>
                  )}
                </div>
              ))}

              <div className="form-group-i">
                <label>Payment Terms:</label>
                <select
                  className="form-control"
                  name="paymentTerms"
                  value={supplier.paymentTerms}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select a payment method
                  </option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="action-buttons">
          {showForm && (
            <button type="submit" className="btn btn-primary-i submit-btn">
              Add New Supplier
            </button>
          )}
          {(isAddingNew || showForm || showAddButton) && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsAddingNew(false);
                setShowForm(false);
                setShowAddButton(false);
                setSearchName("");
                setSupplier({
                  date: new Date().toISOString().split("T")[0],
                  supplierName: "",
                  phone1: "",
                  phone2: "",
                  fax: "",
                  email: "",
                  address: "",
                  supplyProducts: [],
                  paymentTerms: "",
                });
                setErrors({});
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddSupplier;

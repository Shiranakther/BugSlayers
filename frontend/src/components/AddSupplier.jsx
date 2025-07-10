import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./Supplier.css";

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

  // Fetch existing suppliers on component mount
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

    if (name === "phone1" || name === "phone2") {
      value = value.replace(/\D/g, "");
      if (value.length > 10) {
        alert("Contact number must not exceed 10 digits");
        value = value.slice(0, 10);
      }
      if (!validatePhoneNumber(value)) {
        error = "Contact number must be exactly 10 digits and numeric";
      } else if (name === "phone2" && value === supplier.phone1) {
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

    setErrors((prev) => ({ ...prev, [name]: error }));
    return value;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validatedValue = validateFields(name, value);
    setSupplier({ ...supplier, [name]: validatedValue });
  };

  const handleSupplierNameBlur = (e) => {
    const value = e.target.value;
    if (value) {
      validateFields("supplierName", value);
    }
  };

  const handleSearchSupplier = async () => {
    if (!searchName.trim()) {
      alert("Please enter a supplier name to search");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/suppliers/", {
        params: { search: searchName }
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

    let hasErrors = false;
    Object.entries(supplier).forEach(([key, value]) => {
      if (key !== "supplyProducts") {
        const validated = validateFields(key, value);
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

      if (response.data.message) {
        alert(response.data.message);
      } else {
        alert("Supplier operation completed successfully");
      }

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
    <div
      className="container-i form-container-i"
      style={{
        width: "80vw",
        minHeight: "100vh",
        background: "white",
        padding: "0",
        margin: "0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="text-center"
        style={{
          fontSize: "2.2rem",
          fontWeight: "600",
          marginBottom: "30px",
          color: "#2c3e50",
          letterSpacing: "-0.5px",
          padding: "20px 0",
        }}
      >
        Supplier Management System
      </div>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        style={{
          flex: 1,
          background: "#fafafa",
          padding: "30px",
          margin: "0 20px 20px 20px",
          borderRadius: "12px",
          border: "1px solid #e8e8e8",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "25px",
        }}
      >
        {/* Supplier Search Input and Button */}
        <div 
          className="form-group-i" 
          style={{ 
            display: "flex", 
            gap: "20px", 
            alignItems: "flex-end",
            justifyContent: "center",
            marginBottom: "30px"
          }}
        >
          <div style={{ flex: "0 1 600px" }}>
            <label
              htmlFor="searchName"
              style={{
                fontWeight: "600",
                marginBottom: "10px",
                fontSize: "1.3rem",
                color: "#2c3e50",
                display: "block",
              }}
            >
              Search Supplier Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="searchName"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter supplier name"
              style={{
                padding: "20px 24px",
                fontSize: "1.3rem",
                borderRadius: "12px",
                border: "2px solid #ddd",
                background: "white",
                transition: "border-color 0.3s ease",
                width: "100%",
                outline: "none",
                height: "60px",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#666")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
          </div>
          <button
            type="button"
            onClick={handleSearchSupplier}
            className="btn btn-primary-i"
            style={{
              padding: "20px 40px",
              fontSize: "1.3rem",
              fontWeight: "600",
              borderRadius: "12px",
              border: "none",
              background: "#2c3e50",
              color: "white",
              transition: "all 0.3s ease",
              cursor: "pointer",
              textTransform: "none",
              height: "60px",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.background = "#34495e";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.background = "#2c3e50";
            }}
          >
            Check
          </button>
        </div>

        {/* Add New Supplier Button */}
        {showAddButton && (
          <div 
            className="form-group-i"
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <button
              type="button"
              onClick={handleAddNewSupplier}
              className="btn btn-primary-i"
              style={{
                padding: "20px 40px",
                fontSize: "1.3rem",
                fontWeight: "600",
                borderRadius: "12px",
                border: "none",
                background: "#2c3e50",
                color: "white",
                transition: "all 0.3s ease",
                cursor: "pointer",
                textTransform: "none",
                width: "100%",
                maxWidth: "400px",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.background = "#34495e";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.background = "#2c3e50";
              }}
            >
              <FontAwesomeIcon icon={faSquarePlus} className="mr-2" />
              Add New Supplier
            </button>
          </div>
        )}

        {/* Show form only when adding new supplier */}
        {showForm && isAddingNew && (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
              display: "grid",
              gap: "20px",
            }}
          >
            <div className="form-group-i">
              <h5
                style={{
                  marginBottom: "20px",
                  color: "#2c3e50",
                  fontSize: "1.3rem",
                  fontWeight: "600",
                  textAlign: "center",
                  paddingBottom: "10px",
                  borderBottom: "2px solid #ecf0f1",
                }}
              >
                Add New Supplier Details
              </h5>
            </div>

            {/* Grid Layout for Form Fields */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1px",
              }}
            >
              {/* Date Field */}
              <div className="form-group-i">
                <label
                  style={{
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#2c3e50",
                    fontSize: "1rem",
                    display: "block",
                  }}
                >
                  Date:
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={supplier.date}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: "12px 16px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    border: "2px solid #ddd",
                    background: "white",
                    transition: "border-color 0.3s ease",
                    width: "100%",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#666")}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                />
              </div>

              {/* Dynamic Form Fields */}
              {[
                {
                  label: "Supplier Name",
                  key: "supplierName",
                  required: true,
                },
                {
                  label: "Contact Number (Primary)",
                  key: "phone1",
                  required: true,
                },
                {
                  label: "Contact Number (Secondary)",
                  key: "phone2",
                },
                { label: "Fax Number", key: "fax" },
                { label: "Email Address", key: "email" },
                { label: "Address", key: "address" },
              ].map((field) => (
                <div key={field.key} className="form-group-i">
                  <label
                    style={{
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "#2c3e50",
                      fontSize: "1rem",
                      display: "block",
                    }}
                  >
                    {field.label}:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name={field.key}
                    value={supplier[field.key]}
                    onChange={handleInputChange}
                    placeholder={field.label}
                    required={field.required || false}
                    style={{
                      padding: "12px 16px",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #ddd",
                      background: "white",
                      transition: "border-color 0.3s ease",
                      width: "100%",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#666";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#ddd";
                      if (field.key === "supplierName") handleSupplierNameBlur(e);
                    }}
                  />
                  {errors[field.key] && (
                    <div
                      style={{
                        marginTop: "8px",
                        padding: "10px",
                        borderRadius: "6px",
                        background: "#f8d7da",
                        border: "1px solid #f5c6cb",
                        color: "#721c24",
                        fontSize: "0.9rem",
                      }}
                    >
                      {errors[field.key]}
                    </div>
                  )}
                </div>
              ))}

              {/* Payment Terms Field */}
              <div className="form-group-i">
                <label
                  style={{
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#2c3e50",
                    fontSize: "1rem",
                    display: "block",
                  }}
                >
                  Payment Terms:
                </label>
                <select
                  className="form-control"
                  name="paymentTerms"
                  value={supplier.paymentTerms}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: "12px 16px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    border: "2px solid #ddd",
                    background: "white",
                    transition: "border-color 0.3s ease",
                    width: "100%",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#666";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ddd";
                  }}
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

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {showForm && (
            <button
              type="submit"
              className="btn btn-primary-i"
              style={{
                flex: 1,
                maxWidth: "300px",
                padding: "16px 32px",
                fontSize: "1.1rem",
                fontWeight: "600",
                borderRadius: "10px",
                border: "none",
                background: "#2c3e50",
                color: "white",
                transition: "all 0.3s ease",
                cursor: "pointer",
                textTransform: "none",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.background = "#34495e";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.background = "#2c3e50";
              }}
            >
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
              style={{
                flex: 1,
                maxWidth: "200px",
                padding: "16px 32px",
                fontSize: "1.1rem",
                fontWeight: "600",
                borderRadius: "10px",
                border: "2px solid #6c757d",
                background: "white",
                color: "#6c757d",
                transition: "all 0.3s ease",
                cursor: "pointer",
                textTransform: "none",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.background = "#6c757d";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.background = "white";
                e.target.style.color = "#6c757d";
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
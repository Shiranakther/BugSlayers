import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./Supplier.css";

const AddSupplier = ({ onSupplierSelected }) => {
  const [existingSuppliers, setExistingSuppliers] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState("");
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

      // Since backend now stores suppliers with products as arrays, no need to group
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

  const handleProductChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSupplier({
        ...supplier,
        supplyProducts: [...supplier.supplyProducts, value],
      });
    } else {
      setSupplier({
        ...supplier,
        supplyProducts: supplier.supplyProducts.filter(
          (product) => product !== value
        ),
      });
    }
  };

  const handleSupplierNameBlur = (e) => {
    const value = e.target.value;
    if (value) {
      validateFields("supplierName", value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAddingNew && !selectedSupplier) {
      alert("Please select a supplier or choose to add a new one");
      return;
    }

    if (isAddingNew) {
      // Check if at least one product is selected
      if (supplier.supplyProducts.length === 0) {
        alert("Please select at least one product.");
        return;
      }

      // Check if this is adding products to existing supplier
      const isExistingSupplier = selectedSupplier && selectedSupplier !== "";

      let hasErrors = false;
      Object.entries(supplier).forEach(([key, value]) => {
        if (key !== "supplyProducts") {
          // Skip supplyProducts as it's an array
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

        // Handle the new response format
        if (response.data.message) {
          alert(
            `${response.data.message}\nProducts: ${supplier.supplyProducts.join(
              ", "
            )}`
          );
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
        setSelectedSupplier("");
        fetchExistingSuppliers(); // Refresh the suppliers list
      } catch (error) {
        console.error("Error adding supplier:", error);
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert("Failed to add supplier. Please try again.");
        }
      }
    } else {
      // Using existing supplier
      const selected = existingSuppliers.find(
        (s) => s._id === selectedSupplier
      );
      if (selected) {
        alert(`Selected supplier: ${selected.supplierName}`);
        // Call parent callback if provided
        if (onSupplierSelected) {
          onSupplierSelected(selected);
        }
      }
    }
  };

  const handleSupplierSelection = (e) => {
    const value = e.target.value;
    setSelectedSupplier(value);

    if (value === "add_new") {
      setIsAddingNew(true);
      setSelectedSupplier("");
      // Reset form for completely new supplier
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
    } else if (value) {
      // Existing supplier selected - auto fill form
      const selectedSupplierData = existingSuppliers.find(
        (s) => s._id === value
      );
      if (selectedSupplierData) {
        setIsAddingNew(true); // Show the form
        setSupplier({
          date: new Date().toISOString().split("T")[0],
          supplierName: selectedSupplierData.supplierName,
          phone1: selectedSupplierData.phone1,
          phone2: selectedSupplierData.phone2 || "",
          fax: selectedSupplierData.fax || "",
          email: selectedSupplierData.email || "",
          address: selectedSupplierData.address || "",
          supplyProducts: [], // Start with empty products for new addition
          paymentTerms: selectedSupplierData.paymentTerms || "",
        });
      }
    } else {
      setIsAddingNew(false);
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
        {/* Supplier Selection Dropdown */}
        <div className="form-group-i">
          <label
            htmlFor="supplierSelect"
            style={{
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "1.1rem",
              color: "#2c3e50",
              display: "block",
            }}
          >
            Select Supplier or Add New:
          </label>
          <select
            id="supplierSelect"
            className="form-control"
            value={selectedSupplier}
            onChange={handleSupplierSelection}
            disabled={isLoading}
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
          >
            <option value="">
              {isLoading ? "Loading suppliers..." : "Choose a supplier..."}
            </option>
            {existingSuppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.supplierName} - {supplier.supplyProducts.join(", ")}
              </option>
            ))}
            <option value="add_new">Add Completely New Supplier</option>
          </select>
        </div>

        {/* Show selected supplier info */}
        {selectedSupplier && !isAddingNew && (
          <div className="form-group-i">
            <div
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "10px",
                padding: "20px",
                borderLeft: "4px solid #6c757d",
              }}
            >
              <div
                style={{
                  fontSize: "1.1rem",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                <strong>Selected Supplier:</strong>{" "}
                {
                  existingSuppliers.find((s) => s._id === selectedSupplier)
                    ?.supplierName
                }
              </div>
              <div style={{ fontSize: "1rem", marginBottom: "8px" }}>
                <strong>Products:</strong>{" "}
                {existingSuppliers
                  .find((s) => s._id === selectedSupplier)
                  ?.supplyProducts?.join(", ")}
              </div>
              <div style={{ fontSize: "1rem" }}>
                <strong>Contact:</strong>{" "}
                {
                  existingSuppliers.find((s) => s._id === selectedSupplier)
                    ?.phone1
                }
              </div>
            </div>
          </div>
        )}

        {/* Show form only when adding new supplier */}
        {isAddingNew && (
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
                {selectedSupplier && selectedSupplier !== ""
                  ? `Add Products for: ${supplier.supplierName}`
                  : "Add New Supplier Details"}
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
                    readOnly={
                      selectedSupplier &&
                      selectedSupplier !== "" &&
                      field.key !== "supplierName"
                    }
                    style={{
                      padding: "12px 16px",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #ddd",
                      background:
                        selectedSupplier &&
                        selectedSupplier !== "" &&
                        field.key !== "supplierName"
                          ? "#f8f9fa"
                          : "white",
                      transition: "border-color 0.3s ease",
                      width: "100%",
                      outline: "none",
                      cursor:
                        selectedSupplier &&
                        selectedSupplier !== "" &&
                        field.key !== "supplierName"
                          ? "not-allowed"
                          : "text",
                    }}
                    onFocus={(e) => {
                      if (!e.target.readOnly)
                        e.target.style.borderColor = "#666";
                    }}
                    onBlur={(e) => {
                      if (!e.target.readOnly)
                        e.target.style.borderColor = "#ddd";
                      if (field.key === "supplierName")
                        handleSupplierNameBlur(e);
                    }}
                  />
                  {selectedSupplier &&
                    selectedSupplier !== "" &&
                    field.key !== "supplierName" && (
                      <small style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                        This field is pre-filled from existing supplier data
                      </small>
                    )}
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
                  disabled={selectedSupplier && selectedSupplier !== ""}
                  style={{
                    padding: "12px 16px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    border: "2px solid #ddd",
                    background:
                      selectedSupplier && selectedSupplier !== ""
                        ? "#f8f9fa"
                        : "white",
                    transition: "border-color 0.3s ease",
                    width: "100%",
                    outline: "none",
                    cursor:
                      selectedSupplier && selectedSupplier !== ""
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onFocus={(e) => {
                    if (!e.target.disabled) e.target.style.borderColor = "#666";
                  }}
                  onBlur={(e) => {
                    if (!e.target.disabled) e.target.style.borderColor = "#ddd";
                  }}
                >
                  <option value="" disabled>
                    Select a payment method
                  </option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                </select>
                {selectedSupplier && selectedSupplier !== "" && (
                  <small style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                    Payment terms are pre-filled from existing supplier data
                  </small>
                )}
              </div>
            </div>

            {/* Products Selection Section */}
            <div className="form-group-i">
              <label
                style={{
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: "#2c3e50",
                  fontSize: "1.1rem",
                  display: "block",
                }}
              >
                {selectedSupplier && selectedSupplier !== ""
                  ? "Select New Products to Add (Multiple Selection):"
                  : "Select Products (Multiple Selection):"}
              </label>
              {selectedSupplier && selectedSupplier !== "" && (
                <div
                  style={{
                    background: "#e9ecef",
                    border: "1px solid #ced4da",
                    borderRadius: "6px",
                    padding: "12px",
                    marginBottom: "15px",
                  }}
                >
                  <strong>Current Products:</strong>{" "}
                  {existingSuppliers
                    .find((s) => s._id === selectedSupplier)
                    ?.supplyProducts?.join(", ")}
                </div>
              )}
              <div
                style={{
                  border: "2px solid #ddd",
                  padding: "20px",
                  borderRadius: "10px",
                  background: "white",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {[
                    "Mattress",
                    "Cupboard",
                    "Chair",
                    "Table",
                    "Iron Board",
                    "Carrom Board",
                    "Clothes Rack",
                  ].map((product) => (
                    <div
                      key={product}
                      style={{
                        background: supplier.supplyProducts.includes(product)
                          ? "#f8f9fa"
                          : "white",
                        padding: "12px 15px",
                        borderRadius: "8px",
                        border: supplier.supplyProducts.includes(product)
                          ? "2px solid #6c757d"
                          : "2px solid #e9ecef",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          margin: 0,
                          color: "#2c3e50",
                          fontWeight: supplier.supplyProducts.includes(product)
                            ? "600"
                            : "normal",
                        }}
                      >
                        <input
                          type="checkbox"
                          value={product}
                          checked={supplier.supplyProducts.includes(product)}
                          onChange={handleProductChange}
                          style={{
                            marginRight: "10px",
                            transform: "scale(1.2)",
                          }}
                        />
                        {product}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {supplier.supplyProducts.length === 0 && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "12px 16px",
                    borderRadius: "6px",
                    background: "#fff3cd",
                    border: "1px solid #ffeaa7",
                    color: "#856404",
                    fontSize: "0.95rem",
                  }}
                >
                  Please select at least one product
                </div>
              )}
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
            {selectedSupplier && selectedSupplier !== ""
              ? "Add Products to Existing Supplier"
              : isAddingNew
              ? "Add New Supplier"
              : "Select Supplier"}
          </button>

          {(isAddingNew || selectedSupplier) && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsAddingNew(false);
                setSelectedSupplier("");
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

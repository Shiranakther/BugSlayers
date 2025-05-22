import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import '../App.css';

const Sidebar = () => {
  const [isSuppliersOpen, setIsSuppliersOpen] = useState(false); 
  const [isInventoryOpen, setIsInventoryOpen] = useState(false); 
  const [isCustomersOpen, setIsCustomersOpen] = useState(false); 
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const [isSalesOpen, setIsSalesOpen]  = useState(false); 
  const [isInventoryReportOpen, setIsInventoryReportOpen] = useState(false);
 
  const [isPurchasesOpen, setIsPurchasesOpen] = useState(false); // <-- Added separate state for purchases

  const toggleSuppliersDropdown = () => {
    setIsSuppliersOpen(!isSuppliersOpen);
  };

  const toggleInventoryDropdown = () => {
    setIsInventoryOpen(!isInventoryOpen);
  };

  const toggleCustomersDropdown = () => {
    setIsCustomersOpen(!isCustomersOpen);
  };

  const toggleSalesDropdown = () => {
    setIsSalesOpen(!isSalesOpen);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const toggleCatalogDropdown = () => {
    setIsCatalogOpen(!isCatalogOpen);
  };


  const toggleInventoryReportDropdown = () => {
  setIsInventoryReportOpen(!isInventoryReportOpen);
};

  const togglePurchasesDropdown = () => {
    setIsPurchasesOpen(!isPurchasesOpen);
  };


  return (
    <div className="bg-dark text-white vh-100 p-3">
      <h6 className='custom-heading'>New Sisira Furniture</h6>
      <ul className="nav flex-column">

        <li className="nav-item mb-3">
          <Link to="/dashboard" className="nav-link text-white d-flex align-items-center">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Link>
        </li>

        {/* Suppliers Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleSuppliersDropdown}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-truck me-2"></i> Suppliers
            <i className={`bi ${isSuppliersOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isSuppliersOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/suppliers/add" className="nav-link text-white">
                  Add Supplier
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/suppliers/manage" className="nav-link text-white">
                  Manage Suppliers
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Purchases Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={togglePurchasesDropdown}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-basket me-2"></i> Purchases & Reports
            <i className={`bi ${isPurchasesOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isPurchasesOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/purchases/add" className="nav-link text-white">
                  Add Purchase Record
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/purchases/manage" className="nav-link text-white">
                  Manage Purchase Record
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/purchases/report" className="nav-link text-white">
                  Generate Purchase Report
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Inventory Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleInventoryDropdown}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-boxes me-2"></i> Inventory
            <i className={`bi ${isInventoryOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isInventoryOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/inventory/add" className="nav-link text-white">
                  Add Inventory
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/inventory/add1" className="nav-link text-white">
                  Manage Inventory
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Category Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleCategoryDropdown}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-tags me-2"></i> Category
            <i className={`bi ${isCategoryOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isCategoryOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/category/add" className="nav-link text-white">
                  Add Category
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/category/add1" className="nav-link text-white">
                  Manage Category
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Customers Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleCustomersDropdown}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-person-circle me-2"></i> Customers
            <i className={`bi ${isCustomersOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isCustomersOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/customers/add" className="nav-link text-white">
                  Add Customers
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/customers/manage" className="nav-link text-white">
                  Manage Customers
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Sales Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleSalesDropdown}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-receipt me-2"></i> Sales & Reports
            <i className={`bi ${isSalesOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isSalesOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/sales/add" className="nav-link text-white">
                  Add Sales Record
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/sales/manage" className="nav-link text-white">
                  Manage Sales
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/sales/report" className="nav-link text-white">
                  Generate Report
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Catalog Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleCatalogDropdown}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-journal-richtext me-2"></i> Catalog
            <i className={`bi ${isCatalogOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isCatalogOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/catalog/view" className="nav-link text-white">
                  View Catalog
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Bill Page Link */}
        <li className="nav-item mb-3">
          <Link to="/dashboard/bill" className="nav-link text-white d-flex align-items-center">
            <i className="bi bi-calculator me-2"></i> Bill
          </Link>
        </li>




    {/* Inventory Reports Dropdown */}  
    <li className="nav-item mb-3">
      <button 
        className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
        onClick={toggleInventoryReportDropdown}
        style={{ cursor: 'pointer' }}>
      <i className="bi bi-bar-chart-line me-2"></i> Inventory Reports
      <i className={`bi ${isInventoryReportOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
      </button>

    {isInventoryReportOpen && (
    <ul className="nav flex-column ms-3">
      <li className="nav-item mb-2">
        <Link to="/dashboard/inventory/reports/low-stock" className="nav-link text-white">
          Low Stock Report
        </Link>
      </li>
      <li className="nav-item mb-2">
        <Link to="/dashboard/inventory/reports/summary" className="nav-link text-white">
          Inventory Summary
        </Link>
      </li>
    </ul>
    )}
    </li>
 

      </ul>
    </div>
  );
};

export default Sidebar;

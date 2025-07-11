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
  const [isSalesOpen, setIsSalesOpen] = useState(false); 
  const [isInventoryReportOpen, setIsInventoryReportOpen] = useState(false);
  const [isPurchasesOpen, setIsPurchasesOpen] = useState(false); 
  const [isOrdersOpen, setIsOrdersOpen] = useState(false); 
  const [isReturnsOpen, setIsReturnsOpen] = useState(false);

  return (
    <div className="bg-dark text-white vh-100 p-3">
      <h6 className='custom-heading'>New Sisira Furniture</h6>
      <ul className="nav flex-column">

        {/* Dashboard */}
        <li className="nav-item mb-3">
          <Link to="/dashboard" className="nav-link text-white d-flex align-items-center">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Link>
        </li>

        {/* Suppliers */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={() => setIsSuppliersOpen(!isSuppliersOpen)}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-truck me-2"></i> Suppliers
            <i className={`bi ${isSuppliersOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>
          {isSuppliersOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/suppliers/add" className="nav-link text-white">Add Supplier</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/suppliers/manage" className="nav-link text-white">Manage Suppliers</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Purchases & Reports */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={() => setIsPurchasesOpen(!isPurchasesOpen)}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-basket me-2"></i> Purchases & Reports
            <i className={`bi ${isPurchasesOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>
          {isPurchasesOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/purchases/add" className="nav-link text-white">Add Purchase Record</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/purchases/manage" className="nav-link text-white">Manage Purchase Record</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/purchases/report" className="nav-link text-white">Generate Purchase Report</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Orders */}
        <li className="nav-item mb-3">
          <button
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start"
            onClick={() => setIsOrdersOpen(!isOrdersOpen)}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-card-checklist me-2"></i> Orders
            <i className={`bi ${isOrdersOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>
          {isOrdersOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/orders/add" className="nav-link text-white">Add Order</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/orders/manage" className="nav-link text-white">Manage Orders</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Returns & Refunds */}
        <li className="nav-item mb-3">
          <button
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start"
            onClick={() => setIsReturnsOpen(!isReturnsOpen)}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-arrow-return-left me-2"></i> Returns & Refunds
            <i className={`bi ${isReturnsOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>
          {isReturnsOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/returns/manage" className="nav-link text-white">Manage Returns</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/refunds/manage" className="nav-link text-white">Manage Refunds</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Inventory */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={() => setIsInventoryOpen(!isInventoryOpen)}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-boxes me-2"></i> Inventory
            <i className={`bi ${isInventoryOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>
          {isInventoryOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/inventory/add" className="nav-link text-white">Add Inventory</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/inventory/add1" className="nav-link text-white">Manage Inventory</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Category */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-tags me-2"></i> Category
            <i className={`bi ${isCategoryOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>
          {isCategoryOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/category/add" className="nav-link text-white">Add Category</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/subcategory/add" className="nav-link text-white">Add Subcategory</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/category/add1" className="nav-link text-white">Manage Category</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Customers */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={() => setIsCustomersOpen(!isCustomersOpen)}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-person-circle me-2"></i> Customers
            <i className={`bi ${isCustomersOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>
          {isCustomersOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/customers/add" className="nav-link text-white">Add Customers</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/customers/manage" className="nav-link text-white">Manage Customers</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Sales & Reports */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={() => setIsSalesOpen(!isSalesOpen)}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-receipt me-2"></i> Sales & Reports
            <i className={`bi ${isSalesOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>
          {isSalesOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/sales/add" className="nav-link text-white">Add Sales Record</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/sales/manage" className="nav-link text-white">Manage Sales</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/sales/report" className="nav-link text-white">Generate Report</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Catalog */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-journal-richtext me-2"></i> Catalog
            <i className={`bi ${isCatalogOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>
          {isCatalogOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/catalog/view" className="nav-link text-white">View Catalog</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Bill Page */}
        <li className="nav-item mb-3">
          <Link to="/dashboard/bill" className="nav-link text-white d-flex align-items-center">
            <i className="bi bi-calculator me-2"></i> Bill
          </Link>
        </li>


        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={() => setIsInventoryReportOpen(!isInventoryReportOpen)}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-bar-chart-line me-2"></i> Inventory Reports
            <i className={`bi ${isInventoryReportOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>
          {isInventoryReportOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/inventory/reports/low-stock" className="nav-link text-white">Low Stock Report</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/inventory/reports/summary" className="nav-link text-white">Inventory Summary</Link>
              </li>
            </ul>
          )}
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;

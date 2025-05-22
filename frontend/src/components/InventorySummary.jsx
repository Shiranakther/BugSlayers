import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

const COLORS = ["#0d6efd", "#198754", "#dc3545", "#ffc107", "#6f42c1", "#fd7e14"];

const InventorySummary = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [stockTrends] = useState([]); // Placeholder

  useEffect(() => {
    fetchInventoryItems();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [inventoryItems, selectedCategory, searchQuery]);

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inventory');
      const data = await response.json();
      setInventoryItems(data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/category');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c._id === categoryId);
    return cat ? cat.categoryName : 'Unknown';
  };

  const applyFilters = () => {
    let items = [...inventoryItems];

    if (selectedCategory) {
      items = items.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.code?.toLowerCase().includes(q)
      );
    }

    setFilteredItems(items);

    // Pie chart data
    const pieMap = {};
    items.forEach(item => {
      pieMap[item.category] = (pieMap[item.category] || 0) + item.quantity;
    });

    setPieData(
      Object.entries(pieMap).map(([categoryId, value]) => ({
        category: getCategoryName(categoryId),
        value,
      }))
    );

    // Bar chart: top 3 stocked items
    const bars = items
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3)
      .map(item => ({ itemName: item.name, quantity: item.quantity }));

    setBarData(bars);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#000"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${pieData[index].category}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h4 className="fw-bold text-primary">Inventory Summary Report</h4>
        <h6>A comprehensive overview of your current inventory, categorized by stock, sales trends, and more.</h6>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">Total Inventory</h5>
              <h6><b>{filteredItems.length}</b></h6>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-danger">Out of Stock</h5>
              <h6><b>{filteredItems.filter(item => item.quantity === 0).length}</b></h6>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-warning">Low Stock</h5>
              <h6><b>{filteredItems.filter(item => item.quantity < 5).length}</b></h6>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="d-flex justify-content-between mb-4 flex-wrap gap-2">
        <div className="input-group w-auto">
          <label className="input-group-text">Category</label>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((category, idx) => (
              <option key={idx} value={category.categoryName}>{category.categoryName}</option>
            ))}
          </select>
        </div>
        <input
          className="form-control w-auto"
          type="search"
          placeholder="Search by item..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <br />

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <h6>Stock Distribution by Category</h6>
          <div className="card shadow-sm p-3">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-md-6">
          <h5 className="mb-3">Top Stocked Items</h5>
          <div className="card shadow-sm p-3">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="itemName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#0d6efd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stock Trends */}
      <div className="mb-5">
        <h5 className="mb-3">Stock Value Trends</h5>
        <div className="card shadow-sm p-3">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockTrends}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#28a745" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="d-flex justify-content-end gap-3 mt-4">
        <button className="btn btn-outline-secondary">Export CSV</button>
        <button className="btn btn-outline-danger">Export PDF</button>
        <button className="btn btn-outline-dark" onClick={() => window.print()}>Print Report</button>
      </div>
    </div>
  );
};

export default InventorySummary;

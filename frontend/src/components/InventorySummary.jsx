import { useState, useEffect, useMemo } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import furnitureLogo from "../assets/furniture-log.png";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import './InventorySummary.css';

const COLORS = [
  '#A8DADC', '#F4A261', '#B5E48C', '#F8C291', '#9ADCFF',
  '#F7A9A8', '#D3B8AE', '#CDB4DB', '#FFE066'
];

const InventorySummary = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [reportMonth, setReportMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    fetchInventoryItems();
    fetchCategories();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/inventory');
      const data = await res.json();
      setInventoryItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching inventory items:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/category');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const filteredItems = useMemo(() => {
    if (!reportMonth) return inventoryItems;
    const [year, month] = reportMonth.split('-').map(Number);
    return inventoryItems.filter(item => {
      if (!item.dateAdded) return false;
      const d = new Date(item.dateAdded);
      return d.getFullYear() === year && (d.getMonth() + 1) === month;
    });
  }, [inventoryItems, reportMonth]);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.categoryName : 'Unknown';
  };

  const totalValue = filteredItems.reduce(
    (sum, it) => sum + (it.quantity || 0) * (it.sellingPrice || 0),
    0
  );

  const totalItems = filteredItems.length;
  const outOfStock = filteredItems.filter(it => (it.quantity || 0) === 0).length;
  const lowStock = filteredItems.filter(it => (it.quantity || 0) < 5 && (it.quantity || 0) > 0).length;

  const pieData = Object.entries(
    filteredItems.reduce((acc, it) => {
      acc[it.category] = (acc[it.category] || 0) + (it.quantity || 0);
      return acc;
    }, {})
  ).map(([catId, val]) => ({
    category: getCategoryName(catId),
    value: val,
  }));

  const barData = filteredItems
    .map(it => ({
      name: it.productName || 'N/A',
      quantity: it.quantity || 0
    }))
    .sort((a, b) => a.quantity - b.quantity)
    .slice(-5);

  // 🎯 Inventory Value Trends by individual item date (Snake-Like)
  const inventoryValueTrends = useMemo(() => {
  return inventoryItems
    .filter(it => {
      const qty = Number(it.quantity);
      const price = Number(it.sellingPrice);
      return it.dateAdded && qty > 0 && price > 0;
    })
    .map(it => {
      const d = new Date(it.dateAdded);
      const formattedDate = d.toISOString().split('T')[0];
      return {
        date: formattedDate,
        value: Number((it.quantity * it.sellingPrice).toFixed(2))
      };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}, [inventoryItems]);


  const generateCSVData = () => {
    const headers = [
      'No', 'Product', 'Item Code', 'Category', 'Date', 'Supplier',
      'Quantity', 'Unit Price (Rs)', 'Total Value (Rs)',
    ];
    const rows = filteredItems.map((item, i) => {
      const total = (item.quantity || 0) * (item.sellingPrice || 0);
      return [
        i + 1,
        item.productName || 'N/A',
        item.code || 'N/A',
        getCategoryName(item.category),
        item.dateAdded || 'N/A',
        item.supplier || 'N/A',
        item.quantity || 0,
        (item.sellingPrice || 0).toFixed(2),
        total.toFixed(2),
      ];
    });
    return [headers, ...rows];
  };

  const generatePDF = (reportDate = new Date()) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const reportMonthYear = reportDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'long' });

    try {
      doc.addImage(furnitureLogo, 'PNG', 14, 10, 25, 25);
      doc.setFontSize(13);
      doc.setTextColor(40);
      doc.text('New Sisira Furniture', 45, 15);

      doc.setFontSize(10);
      doc.text('No 156, Sisira Furniture, Matara Road, Kamburupitiya', 45, 21);
      doc.text('Tel: 077-3211603 | 071-8006485', 45, 27);

      doc.setFontSize(12);
      doc.setTextColor(60);
      doc.text('Inventory Summary Report', 14, 45);
      doc.setFontSize(11);
      doc.text(`Report Month: ${reportMonthYear}`, 14, 53);

      const generationDate = new Date().toLocaleDateString('en-GB');
      doc.setFontSize(10);
      doc.text(`Date Generated: ${generationDate}`, pageWidth - 14, 45, { align: 'right' });

      const tableColumn = [
        'No', 'Product', 'Item Code', 'Category', 'Date', 'Supplier',
        'Quantity', 'Unit Price (Rs)', 'Total Value (Rs)',
      ];

      const tableRows = filteredItems.map((item, i) => {
        const total = (item.quantity || 0) * (item.sellingPrice || 0);
        return [
          i + 1,
          item.productName || 'N/A',
          item.code || 'N/A',
          getCategoryName(item.category),
          item.dateAdded || 'N/A',
          item.supplier || 'N/A',
          item.quantity || 0,
          (item.sellingPrice || 0).toFixed(2),
          total.toFixed(2),
        ];
      });

      autoTable(doc, {
        startY: 60,
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [52, 73, 94], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
        didDrawPage: () => {
          const str = `Page ${doc.internal.getNumberOfPages()}`;
          doc.setFontSize(9);
          doc.text(str, pageWidth - 14, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
        },
      });

      doc.save('inventory-summary-report.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
    }
  };

  const handleGeneratePDF = () => {
    const [year, month] = reportMonth.split('-');
    generatePDF(new Date(year, month - 1));
  };

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={11}
      >
        {`${pieData[index].category}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="inventory-report-wrapper">
      <header className="company-header">
        <h6 className="company-name"><b><center>New Sisira Furniture</center></b></h6>
        <h6 className="report-name"><b><center>Inventory Summary Report</center></b></h6>
      </header>

      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label htmlFor="report-month">Select Report Month:</label>
        <input
          type="month"
          id="report-month"
          value={reportMonth}
          onChange={(e) => setReportMonth(e.target.value)}
        />
      </div>

      <section className="summary-cards">
        <div className="summary-card"><div className="card-label">Total Inventory Items</div><div className="card-value">{totalItems}</div></div>
        <div className="summary-card"><div className="card-label">Total Value (Rs)</div><div className="card-value">{totalValue.toFixed(2)}</div></div>
        <div className="summary-card"><div className="card-label">Out of Stock</div><div className="card-value">{outOfStock}</div></div>
        <div className="summary-card"><div className="card-label">Low Stock</div><div className="card-value">{lowStock}</div></div>
      </section>

      <section className="charts-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="chart-container" style={{ flex: 1 }}>
          <h6><b>Stock Distribution by Category</b></h6>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={70}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} items`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container" style={{ flex: 1 }}>
          <h6><b>Top 5 Stocked Items</b></h6>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            >
              <XAxis
                type="number"
                label={{ value: 'Quantity', position: 'insideBottomRight', offset: -5 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                tick={{ fontSize: 12, fill: '#34495e' }}
              />
              <Tooltip />
              <Bar dataKey="quantity" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="charts-row" style={{ marginTop: '2rem' }}>
        <div className="chart-container" style={{ width: '100%' }}>
          <h6><b>Inventory Value Trends</b></h6>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={inventoryValueTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `Rs ${value.toFixed(2)}`} labelFormatter={(label) => `Date: ${label}`} />
              <Legend />
              <Line type="natural" dataKey="value" stroke={COLORS[1]} strokeWidth={3} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="table-section">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>No</th><th>Product</th><th>Item Code</th><th>Category</th>
              <th>Date</th><th>Supplier</th><th>Quantity</th>
              <th>Unit Price (Rs)</th><th>Total Value (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, i) => {
              const total = (item.quantity || 0) * (item.sellingPrice || 0);
              return (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>{item.productName || 'N/A'}</td>
                  <td>{item.code || 'N/A'}</td>
                  <td>{getCategoryName(item.category)}</td>
                  <td>{item.dateAdded || 'N/A'}</td>
                  <td>{item.supplier || 'N/A'}</td>
                  <td>{item.quantity || 0}</td>
                  <td>{(item.sellingPrice || 0).toFixed(2)}</td>
                  <td>{total.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <footer className="report-footer">
        <button className="pdf-button" onClick={handleGeneratePDF}>Generate Monthly PDF</button>
        <CSVLink className="csv-button" data={generateCSVData()} filename="inventory-report.csv">
          Export to CSV
        </CSVLink>
      </footer>
    </div>
  );
};

export default InventorySummary;

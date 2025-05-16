import { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import myImage from '../assets/furniture-log.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faCalendarDays, faChartBar, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './SalesReports.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SalesReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date cannot be after end date.');
      return;
    }
    setLoading(true);
    setSubmitted(true);  // Mark as submitted
    try {
      const response = await axios.get('http://localhost:5000/api/reports/sales-report', {
        params: { startDate, endDate },
      });
      if (response.data.length === 0) {
        setReport([]);  // No data, reset report state to empty
      } else {
        setReport(response.data);  // Set report with data
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setReport([]); // In case of an error, set report to empty
    }
    setLoading(false);
  };

  const totalQuantity = report.reduce((sum, item) => sum + item.totalQuantity, 0);
  const totalAmountOfSales = report.reduce((sum, item) => sum + item.totalQuantity*item.totalSales, 0);

  // Find the most popular item (with the highest total sales)
  const mostPopularItem = report.reduce((maxItem, item) => 
    item.totalSales > maxItem.totalSales ? item : maxItem, report[0]);

  const generatePDF = (isDownload) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = margin;

    doc.setLineWidth(0.5);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    const logoWidth = 35;
    const logoHeight = 35;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(myImage, 'PNG', logoX, y, logoWidth, logoHeight);
    y += logoHeight + 5;

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('New Sisira Furniture Shop', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('No. 156, Matara Road, Kamburupitiya', pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.text('Email: sisirafurniture@gmail.com | Phone: 077-3211603 / 071-8006485', pageWidth / 2, y, { align: 'center' });
    y += 10;

    doc.setLineWidth(0.1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('Sales Report', margin, y);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`From: ${startDate}  To: ${endDate}`, pageWidth - margin, y, { align: 'right' });
    y += 8;

    doc.setFont(undefined, 'bold');
    doc.setFillColor(230, 230, 230);
    const col1X = margin + 2;
    const col2X = pageWidth / 3;
    const col3X = (pageWidth / 3) * 2;
    const col4X = pageWidth - margin - 2;

    doc.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');
    doc.text('Product Name', col1X, y);
    doc.text('Quantity', col2X, y, { align: 'center' });
    doc.text('Price', col3X, y, { align: 'right' });
    doc.text('Sales (Rs.)', col4X, y, { align: 'right' });
    y += 8;

    doc.setFont(undefined, 'normal');
    report.forEach((item) => {
      const productName = item._id;
      const quantity = item.totalQuantity.toString();
      const sales = item.totalSales.toFixed(2).toString();
      const amount = (item.totalQuantity * item.totalSales).toFixed(2).toString();

      doc.text(productName, col1X, y);
      doc.text(quantity, col2X, y, { align: 'center' });
      doc.text(sales, col3X, y, { align: 'center' });
      doc.text(amount, col4X, y, { align: 'right' });

      y += 8;
      if (y > pageHeight - 30) {
        doc.addPage();
        y = margin;
      }
    });

    y += 6;
    doc.setFont(undefined, 'bold');
    doc.text(`Total Quantity: ${totalQuantity}`, margin, y);
    y += 6;
    doc.text(`Total Sales: Rs. ${totalAmountOfSales.toFixed(2)}`, margin, y);

    const footerY = pageHeight - 10;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, footerY);
    doc.text(`Page 1 of 1`, pageWidth - margin, footerY, { align: 'right' });

    if (isDownload) {
      doc.save(`sales_report_${startDate}_to_${endDate}.pdf`);
    } else {
      const pdfData = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfData);
      window.open(pdfUrl, '_blank');
    }
  };

  const pieData = {
    labels: report.map((item) => item._id),
    datasets: [
      {
        label: 'Total Sales',
        data: report.map((item) => item.totalQuantity*item.totalSales),
        backgroundColor: [
          '#4e73df',
          '#1cc88a',
          '#36b9cc',
          '#f6c23e',
          '#e74a3b',
          '#858796',
          '#5a5c69',
          '#2e59d9',
          '#17a673',
          '#2c9faf',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
      datalabels: {
        color: 'black',
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}: Rs. ${value.toFixed(2)}`;
        },
        font: {
          weight: 'bold',
          size: 10,
        },
      },
    },
  };

  return (
    <div className="container mt-4">
      <h3>
        <FontAwesomeIcon icon={faChartBar} className="me-2 text-primary" />
        Generate Sales Report
      </h3>

      <form onSubmit={handleSubmit} className="border p-3 rounded mb-4 shadow-sm">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="startDate" className="form-label">
              <FontAwesomeIcon icon={faCalendarDays} className="me-1" />Start Date
            </label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="endDate" className="form-label">
              <FontAwesomeIcon icon={faCalendarDays} className="me-1" />End Date
            </label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          <FontAwesomeIcon icon={faChartBar} className="me-2" />Generate Report
        </button>
      </form>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : submitted && report.length === 0 ? (
        <div className="alert alert-info mt-4">
          No sales data available for the selected date range.
        </div>
      ) : report.length > 0 ? (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Report Results</h5>
          </div>

          <table className="sales">
            <thead className="table-dark">
              <tr>
                <th>Product Name</th>
                <th>Total Quantity</th>
                <th>Price</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {report.map((item, index) => (
                <tr key={index}>
                  <td>{item._id}</td>
                  <td>{item.totalQuantity}</td>
                  <td>Rs. {item.totalSales.toFixed(2)}</td>
                  <td>Rs. {(item.totalQuantity * item.totalSales).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3">
            <strong>Total Quantity Sold:</strong> {totalQuantity} <br />
            <strong>Total Amount of Sales:</strong> Rs. {totalAmountOfSales.toFixed(2)}
          </div>

          <div className="d-flex justify-content-between mt-4">
          <div className="text-center" style={{ width: '350px', height: '350px', margin: '20px 0 0 100px' }}>
              <Pie data={pieData} options={pieOptions} />
            </div>

            {/* Most Popular Item Box */}
            <div
              className="card shadow-sm"
              style={{
                width: '300px',
                height: '200px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginRight: '100px',
                marginTop: '60px',
              }}
            >
            
             <h6 className="most-popular-title">Most Popular Item</h6>
             <div className="most-popular-item">
             <h5 className="item-name">{mostPopularItem._id}</h5>
             <p className="item-sales">Total Sales: Rs. {mostPopularItem.totalSales.toFixed(2)}</p>
             <p className="item-quantity">Total Quantity: {mostPopularItem.totalQuantity}</p>
             </div>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-danger custom-btn" style={{ marginLeft: '530px' }} onClick={() => generatePDF(false)}>
              <FontAwesomeIcon icon={faFilePdf} className="me-2" /> View PDF
            </button>
            <button className="btn btn-success custom-btn" onClick={() => generatePDF(true)}>
              <FontAwesomeIcon icon={faDownload} className="me-2" /> Download PDF
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};


export default SalesReport;

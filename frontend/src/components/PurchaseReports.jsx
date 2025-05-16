import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./PurchaseReport.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faCalendarDays, faChartBar, faDownload } from '@fortawesome/free-solid-svg-icons';

const PurchaseReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/purchase-report/purchase-report", {
        params: { startDate, endDate },
      });
      // Adjust the response to match the expected structure
      setReportData(response.data);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Purchase Report", 20, 10);
    doc.text(`From: ${startDate} To: ${endDate}`, 20, 20);
    let y = 30;
    reportData.forEach((item) => {
      // Using '_id' for productName, 'totalQuantity', and 'totalSpent' instead of 'totalPrice'
      doc.text(
        `Product: ${item._id}, Quantity: ${item.totalQuantity}, Total: ${item.totalSpent}`,
        20,
        y
      );
      y += 10;
    });
    doc.save(`purchase_report_${startDate}_to_${endDate}.pdf`);
  };

  return (
    <div className="purchase-report-container">
      <h2>Purchase Report</h2>
      <form onSubmit={handleGenerateReport} className="report-form">
      
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

      {reportData.length > 0 && (
        <div className="report-results">
          <table className="report-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Total Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  <td>{item._id}</td>{" "}
                  {/* Adjusted to match the response (_id field for productName) */}
                  <td>{item.totalQuantity}</td>
                  <td>{item.totalSpent}</td>{" "}
                  {/* Adjusted to match the response (totalSpent for price) */}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleDownloadPDF}>Download PDF</button>
        </div>
      )}
    </div>
  );
};

export default PurchaseReport;

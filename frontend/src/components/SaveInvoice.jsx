import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';

function SaveInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/invoices');
        setInvoices(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch invoices.');
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const toggleExpand = (invoiceId) => {
    setExpandedInvoiceId(prevId => (prevId === invoiceId ? null : invoiceId));
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this invoice?');
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5000/api/invoices/${id}`);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      alert('Invoice deleted successfully');
    } catch (err) {
      alert('Failed to delete invoice.');
    }
  };

  const calculateProfit = (item) => {
    const selling = parseFloat(item.itemPrice || 0);
    const buying = parseFloat(item.buyingPrice || 0);
    const qty = parseInt(item.quantity || 0);
    const discount = parseFloat(item.discount || 0);
    return ((selling - buying) * qty - discount).toFixed(2);
  };

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2 className='topic'>
        <FontAwesomeIcon icon={faFileInvoice} className="invoice-icon" />
        Manage Invoices
      </h2>
      <table className="invoice-table" border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Customer Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Total Items</th>
            <th>Subtotal</th>
            <th>Amount</th>
            <th>Cash Received</th>
            <th>Balance</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <React.Fragment key={inv._id}>
              <tr>
                <td>
                  <button
                    className='invoice-id-btn'
                    onClick={() => toggleExpand(inv._id)}
                  >
                    {inv.invoiceId}
                  </button>
                </td>
                <td>{inv.date}</td>
                <td>{inv.time}</td>
                <td>{inv.name}</td>
                <td>{inv.contact}</td>
                <td>{inv.email}</td>
                <td>{inv.items?.length || 0}</td>
                <td>{inv.subtotal}</td>
                <td>{inv.amount}</td>
                <td>{inv.cashReceived}</td>
                <td>{inv.balance}</td>
                <td>
                  <FaTrash
                    onClick={() => handleDelete(inv._id)}
                    style={{ cursor: 'pointer', color: 'red' }}
                  />
                </td>
              </tr>

              {expandedInvoiceId === inv._id && (
                <tr>
                  <td colSpan="12" style={{ backgroundColor: '#f9f9f9' }}>
                    <strong>Item Details:</strong>
                    <table border="1" cellPadding="6" style={{ marginTop: '10px', width: '100%' }}>
                      <thead>
                        <tr>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Price</th>
                          <th>Buying Price</th>
                          <th>Quantity</th>
                          <th>Discount</th>
                          <th>Total</th>
                          <th>Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inv.items?.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.itemCode}</td>
                            <td>{item.itemName}</td>
                            <td>{item.itemPrice}</td>
                            <td>{item.buyingPrice}</td>
                            <td>{item.quantity}</td>
                            <td>{item.discount}</td>
                            <td>{(item.itemPrice * item.quantity - item.discount).toFixed(2)}</td>
                            <td>{calculateProfit(item)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SaveInvoice;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SaveInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all invoices on component mount
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

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>All Invoices</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Customer Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Subtotal</th>
            <th>Amount</th>
            <th>Cash Received</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td>{inv.invoiceId}</td>
              <td>{inv.date}</td>
              <td>{inv.time}</td>
              <td>{inv.name}</td>
              <td>{inv.contact}</td>
              <td>{inv.email}</td>
              <td>{inv.subtotal}</td>
              <td>{inv.amount}</td>
              <td>{inv.cashReceived}</td>
              <td>{inv.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SaveInvoice;

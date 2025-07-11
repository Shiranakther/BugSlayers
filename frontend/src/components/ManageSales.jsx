import { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageSales.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';

const ManageSales = () => {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await axios.get('/api/invoices');
      let globalIndex = 0;

      const flattened = res.data.flatMap((invoice) =>
        invoice.items.map((item) => {
          const price = Number(item.itemPrice || 0);
          const qty = Number(item.quantity || 0);
          const buyingPrice = Number(item.buyingPrice || 0); // must be added in invoice items
          const discount = Number(item.discount || 0);
          const profit = Number(item.profit || 0); // this must also be included in invoice items

          const row = {
            salesId: `S${String(globalIndex + 1).padStart(4, '0')}`,
            itemCode: item.itemCode,
            itemName: item.itemName,
            price,
            buyingPrice,
            quantity: qty,
            discount,
            total: price * qty - discount,
            profit,
            date: invoice.date || 'N/A',
          };

          globalIndex++;
          return row;
        })
      );

      setRows(flattened);

      // Save to product sales collection
      await axios.post('/api/productsales/import', flattened);
    } catch (error) {
      console.error('Error fetching or saving product sales:', error);
    }
  };

  const filteredRows = rows.filter((row) => {
    const term = searchTerm.toLowerCase();
    return (
      row.salesId.toLowerCase().includes(term) ||
      row.itemCode?.toLowerCase().includes(term) ||
      row.date?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container mt-4">
      <h3>
        <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
        Manage Product Sales
      </h3>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by Sales ID, Item Code, or Date"
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="sales">
        <thead>
          <tr>
            <th>Sales ID</th>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Price</th>
            <th>Buying Price</th>
            <th>Quantity</th>
            <th>Discount</th>
            <th>Total</th>
            <th>Profit</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.length > 0 ? (
            filteredRows.map((r, i) => (
              <tr key={i}>
                <td>{r.salesId}</td>
                <td>{r.itemCode}</td>
                <td>{r.itemName}</td>
                <td>{r.price.toFixed(2)}</td>
                <td>{r.buyingPrice.toFixed(2)}</td>
                <td>{r.quantity}</td>
                <td>{r.discount.toFixed(2)}</td>
                <td>{r.total.toFixed(2)}</td>
                <td>{r.profit.toFixed(2)}</td>
                <td>{r.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">
                No matching results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageSales;

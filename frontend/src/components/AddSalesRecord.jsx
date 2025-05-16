import { useState, useEffect } from 'react';
import axios from 'axios';
import './Sales.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddSalesRecord = () => {
  const [customerName, setCustomerName] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState(0);

  // Calculate amount whenever quantity or price changes
  useEffect(() => {
    const qty = parseFloat(quantity) || 0;
    const prc = parseFloat(price) || 0;
    setAmount(qty * prc);
  }, [quantity, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send quantity and price as numbers
      const newSale = {
        customerName,
        productName,
        quantity: Number(quantity),
        price: Number(price)
        // No amount sent, backend will calculate
      };

      await axios.post('http://localhost:5000/api/sales/add', newSale);

      // Clear form
      setCustomerName('');
      setProductName('');
      setQuantity('');
      setPrice('');
      setAmount(0);

      alert('Sale record added successfully!');
    } catch (error) {
      console.error('Error adding sale record:', error);
      alert('Failed to add sale record');
    }
  };

  return (
    <div className="container-addsales">
      <h3><FontAwesomeIcon icon={faPlus} className="addsales-icon" />Add Sales Record</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="customerName" className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="0"
            step="any"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="any"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            id="amount"
            value={amount.toFixed(2)}
            readOnly
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Sale</button>
      </form>
    </div>
  );
};

export default AddSalesRecord;

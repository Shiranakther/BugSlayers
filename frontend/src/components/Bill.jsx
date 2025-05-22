import { useState } from 'react';
import axios from 'axios';
import './Bill.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';

function BillForm() {
 
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]); // Default to today's date

 
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [cashReceived, setCashReceived] = useState(0);
  const [balance, setBalance] = useState(0);

  // State to show/hide invoice section
  const [showInvoice, setShowInvoice] = useState(false);

  // Auto-fill customer data by name (calls backend)
  const handleNameChange = async (e) => {
    const enteredName = e.target.value;
    setName(enteredName);

    try {
      const res = await axios.get(`/api/customers/name/${enteredName}`);
      const customer = res.data;
      setAddress(customer.address || '');
      setContact(customer.contact || '');
      setEmail(customer.email || '');
    } catch {
      // Clear fields if no customer found
      setAddress('');
      setContact('');
      setEmail('');
    }
  };

  // Auto-fill item data by code (calls backend)
  const handleItemCodeChange = async (e) => {
    const code = e.target.value;
    setItemCode(code);

    try {
      const res = await axios.get(`/api/items/code/${code}`);
      const item = res.data;
      setItemName(item.name || '');
      setItemPrice(item.price || '');
    } catch {
      // Clear fields if item not found
      setItemName('');
      setItemPrice('');
    }
  };

  // Calculate total price without discount
  const calculatePrice = () => {
    const price = parseFloat(itemPrice || 0);
    return (price * quantity).toFixed(2);
  };

  // Calculate amount after applying discount
  const calculateAmount = () => {
    const total = parseFloat(calculatePrice());
    return (total - discount).toFixed(2);
  };

  // Calculate balance based on cash received
  const calculateBalance = () => {
    const amount = parseFloat(calculateAmount());
    const balanceAmt = cashReceived - amount;
    setBalance(balanceAmt >= 0 ? balanceAmt : 0);
  };

  // Show invoice section and calculate balance
  const handleGenerateInvoice = () => {
    setShowInvoice(true);
    calculateBalance();
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='invoice-form'>
      <h3 className='bill-topic'><FontAwesomeIcon icon={faFileInvoice} className="bill-icon" /> Generate Invoice</h3>
      
      <form>
        <h4>Customer Details</h4>

        {/* Customer input fields */}
        <div className="inline-field">
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="inline-field">
          <label>Customer Name:</label>
          <input type="text" value={name} onChange={handleNameChange} />
        </div>

        <div className="inline-field">
          <label>Address:</label>
          <input type="text" value={address} readOnly />
        </div>

        <div className="inline-field">
          <label>Contact:</label>
          <input type="text" value={contact} readOnly />
        </div>

        <div className="inline-field">
          <label>Email:</label>
          <input type="text" value={email} readOnly />
        </div>

        <hr />
        <h4>Item Details</h4>

        {/* Item input fields */}
        <div className="inline-field">
          <label>Item Code:</label>
          <input type="text" value={itemCode} onChange={handleItemCodeChange} />
        </div>

        <div className="inline-field">
          <label>Item Name:</label>
          <input type="text" value={itemName} readOnly />
        </div>

        <div className="inline-field">
          <label>Item Price:</label>
          <input type="text" value={itemPrice} readOnly />
        </div>

        <div className="inline-field">
          <label>Quantity:</label>
          <input type="number" value={quantity} min="1" onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>

        <div className="inline-field">
          <label>Price:</label>
          <input type="text" value={calculatePrice()} readOnly />
        </div>

        <div className="inline-field">
          <label>Discount:</label>
          <input type="number" value={discount} min="0" onChange={(e) => setDiscount(Number(e.target.value))} />
        </div>

        <div className="inline-field">
          <label>Amount:</label>
          <input type="text" value={calculateAmount()} readOnly />
        </div>

        <div className="inline-field">
          <label>Cash Received:</label>
          <input type="number" value={cashReceived} onChange={(e) => setCashReceived(Number(e.target.value))} />
        </div>

        <div className="inline-field">
          <label>Balance:</label>
          <input type="text" value={balance.toFixed(2)} readOnly />
        </div>

        {/* Action buttons */}
        <div style={{ marginTop: '15px' }}>
          <button type="button" onClick={handleGenerateInvoice}>
            Generate Invoice
          </button>
          <button type="button" onClick={handlePrint} style={{ marginLeft: '10px' }}>
            Print Invoice
          </button>
        </div>
      </form>

      {/* Invoice preview section */}
      {showInvoice && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #000' }}>
          <h3>Invoice</h3>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Customer:</strong> {name}</p>
          <p><strong>Item:</strong> {itemName}</p>
          <p><strong>Quantity:</strong> {quantity}</p>
          <p><strong>Item Price:</strong> ${itemPrice}</p>
          <p><strong>Price:</strong> ${calculatePrice()}</p>
          <p><strong>Discount:</strong> ${discount}</p>
          <p><strong>Amount:</strong> ${calculateAmount()}</p>
          <p><strong>Cash Received:</strong> ${cashReceived}</p>
          <p><strong>Balance:</strong> ${balance.toFixed(2)}</p>
          <button onClick={handlePrint}>Print</button>
        </div>
      )}
    </div>
  );
}

export default BillForm;


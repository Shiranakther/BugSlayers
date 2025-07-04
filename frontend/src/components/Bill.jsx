import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Bill.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';

function BillForm() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  /*item dedails*/ 
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [cashReceived, setCashReceived] = useState(0);
  const [balance, setBalance] = useState(0);

   /*invoice dedails*/ 
  const [showInvoice, setShowInvoice] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const cleanContact = contact.trim();

    if (cleanContact.length === 10) {
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await axios.get(`/api/customers/contact/${cleanContact}`);
          const customer = res.data;
          setName(customer.name || '');
          setAddress(customer.address || '');
          setEmail(customer.email || '');
          setFetchError('');
        } catch (error) {
          setName('');
          setAddress('');
          setEmail('');
          setFetchError('Customer not found');
        }
      }, 500);
    } else {
      setName('');
      setAddress('');
      setEmail('');
      setFetchError('');
    }

    return () => clearTimeout(debounceRef.current);
  }, [contact]);

  const handleItemCodeChange = async (e) => {
    const code = e.target.value.trim();
    setItemCode(code);

    if (code) {
      try {
        const res = await axios.get(`/api/items/code/${code}`);
        const item = res.data;
        setItemName(item.name || '');
        setItemPrice(parseFloat(item.price).toFixed(2) || '');
      } catch (err) {
        setItemName('');
        setItemPrice('');
      }
    } else {
      setItemName('');
      setItemPrice('');
    }
  };

  const calculatePrice = () => {
    const price = parseFloat(itemPrice || 0);
    return (price * quantity).toFixed(2);
  };

  const calculateAmount = () => {
    const total = parseFloat(calculatePrice());
    const disc = parseFloat(discount || 0);
    return (total - disc).toFixed(2);
  };

  useEffect(() => {
    const amount = parseFloat(calculateAmount());
    const cash = parseFloat(cashReceived || 0);
    const bal = cash - amount;
    setBalance(bal >= 0 ? bal : 0);
  }, [cashReceived, discount, quantity, itemPrice]);

  const handleGenerateInvoice = () => {
    if (!name || !email) {
      alert('Please enter a valid 10-digit contact number to fetch customer details.');
      return;
    }
    setShowInvoice(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='invoice-form'>
      <h3 className='bill-topic'>
        <FontAwesomeIcon icon={faFileInvoice} className="bill-icon" /> Generate Invoice
      </h3>

      <form onSubmit={(e) => e.preventDefault()}>
        <h4>Customer Details</h4>

        <div className="inline-field">
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="inline-field">
          <label>Contact:</label>
          <input
            type="text"
            value={contact}
            onChange={(e) =>
              setContact(e.target.value.replace(/\D/g, '').substring(0, 10).trim())
            }
            maxLength={10}
            placeholder="Enter 10-digit contact"
          />
        </div>

        {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}

        <div className="inline-field">
          <label>Customer Name:</label>
          <input type="text" value={name} readOnly />
        </div>

        <div className="inline-field">
          <label>Address:</label>
          <input type="text" value={address} readOnly />
        </div>

        <div className="inline-field">
          <label>Email:</label>
          <input type="text" value={email} readOnly />
        </div>

        <hr />
        <h4>Item Details</h4>

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
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="inline-field">
          <label>Price:</label>
          <input type="text" value={calculatePrice()} readOnly />
        </div>

        <div className="inline-field">
          <label>Discount:</label>
          <input
            type="number"
            min="0"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </div>

        <div className="inline-field">
          <label>Amount:</label>
          <input type="text" value={calculateAmount()} readOnly />
        </div>

        <div className="inline-field">
          <label>Cash Received:</label>
          <input
            type="number"
            min="0"
            value={cashReceived}
            onChange={(e) => setCashReceived(Number(e.target.value))}
          />
        </div>

        <div className="inline-field">
          <label>Balance:</label>
          <input type="text" value={balance.toFixed(2)} readOnly />
        </div>

        <div style={{ marginTop: '15px' }}>
          <button type="button" onClick={handleGenerateInvoice}>Generate Invoice</button>
          <button type="button" onClick={handlePrint} style={{ marginLeft: '10px' }}>Print Invoice</button>
        </div>
      </form>

      {showInvoice && (
        <div className="invoice-preview">
          <h3>Invoice</h3>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Customer:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Address:</strong> {address}</p>
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

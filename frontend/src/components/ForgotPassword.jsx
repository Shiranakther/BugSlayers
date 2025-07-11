import { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Reuse the signup/login styling
import myImage from '../assets/furniture-log.png';
import backgroundImage from '../assets/furniture.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="container-wrapper-login">
        <div className="info-container">
          <img src={myImage} alt="Furniture" className="login-image" />
          <h2>Password Help</h2>
          <p className="logpara">
            Forgot your password? No worries. Enter your email, and we'll send a reset link.
          </p>
        </div>

        <div className="login-container">
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn">Send Reset Link</button>
          </form>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <p className="para">
            Remember your password? <a href="/">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

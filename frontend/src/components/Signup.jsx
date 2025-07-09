import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; 
import myImage from '../assets/furniture-log.png';
import backgroundImage from '../assets/furniture.png'; 


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post('/api/auth/signup', {
        email,
        password,
      });

      if (response.data.success) {
        alert('Signup successful! Please log in.');
        navigate('/'); // Redirect to login page
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(
        'Signup failed: ' + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="container-wrapper-login">
        <div className="info-container">
          <img src={myImage} alt="Furniture" className="login-image" />
          <h2>Welcome To</h2>
          <p className='logpara'>
            Manage your furniture business with ease and efficiency, streamline operations.
          </p>
        </div>
        <div className="login-container">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
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

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn">Sign Up</button>
          </form>
          <p className='para'>
            Already have an account?{' '}
            <a href="/">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

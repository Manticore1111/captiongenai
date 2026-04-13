import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

function Payment() {
  const [type, setType] = useState('one-time');
  const navigate = useNavigate();

  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/payments/create-session', { type }, { headers: { Authorization: `Bearer ${token}` } });
    window.location.href = res.data.url;
  };

  return (
    <div className="payment">
      <h1>Upgrade to Premium</h1>
      <div className="pricing">
        <div className={`card ${type === 'one-time' ? 'selected' : ''}`} onClick={() => setType('one-time')}>
          <h2>One-Time Unlock</h2>
          <p>€4.99</p>
          <ul>
            <li>Unlimited access</li>
            <li>All games</li>
            <li>Advanced features</li>
          </ul>
        </div>
        <div className={`card ${type === 'monthly' ? 'selected' : ''}`} onClick={() => setType('monthly')}>
          <h2>Monthly Subscription</h2>
          <p>€7.99/month</p>
          <ul>
            <li>Unlimited access</li>
            <li>All games</li>
            <li>Advanced features</li>
            <li>7-day free trial</li>
          </ul>
        </div>
      </div>
      <button onClick={handlePayment}>Proceed to Payment</button>
      <p>Secure payment with Stripe. iDEAL supported.</p>
    </div>
  );
}

export default Payment;
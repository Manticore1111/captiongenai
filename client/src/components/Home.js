import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const generateCaptions = async () => {
    setLoading(true);
    setError('');
    const freeUsed = localStorage.getItem('freeUsed');
    const token = localStorage.getItem('token');

    let url = 'http://localhost:5000/api/captions/free-generate';
    let headers = {};

    if (freeUsed && !token) {
      setError('Free generation used. Please login or register to continue.');
      setLoading(false);
      return;
    } else if (token) {
      url = 'http://localhost:5000/api/captions/generate';
      headers = { Authorization: `Bearer ${token}` };
    }

    try {
      const response = await axios.post(url, { topic, platform }, { headers });
      setResults(response.data);
      if (!freeUsed) {
        localStorage.setItem('freeUsed', 'true');
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Free generation used. Please subscribe to continue.');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Error generating captions');
      }
    }
    setLoading(false);
  };

  const unlockAll = () => {
    // Placeholder for payment
    window.open('https://buy.stripe.com/placeholder', '_blank');
    // Simulate unlock after payment
    setUnlocked(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="home">
      <header>
        <h1>ViralCaption AI</h1>
        <p>Go Viral with AI Captions</p>
      </header>
      <section className="pricing">
        <h2>Choose Your Plan</h2>
        <div className="pricing-cards">
          <div className="pricing-card">
            <img src="https://via.placeholder.com/150/4facfe/ffffff?text=Free" alt="Free Plan" />
            <h3>Free</h3>
            <p>€0</p>
            <ul>
              <li>1 Generation per day</li>
              <li>Basic captions</li>
            </ul>
          </div>
          <div className="pricing-card">
            <img src="https://via.placeholder.com/150/f093fb/ffffff?text=Pro" alt="Pro Plan" />
            <h3>Pro</h3>
            <p>€2.99/month</p>
            <ul>
              <li>Unlimited generations</li>
              <li>Advanced captions</li>
              <li>All platforms</li>
            </ul>
          </div>
          <div className="pricing-card">
            <img src="https://via.placeholder.com/150/667eea/ffffff?text=Premium" alt="Premium Plan" />
            <h3>Premium</h3>
            <p>€9.99/month</p>
            <ul>
              <li>Everything in Pro</li>
              <li>Custom branding</li>
              <li>Priority support</li>
            </ul>
          </div>
        </div>
      </section>
      <main>
        <form onSubmit={(e) => { e.preventDefault(); generateCaptions(); }}>
          <input
            type="text"
            placeholder="Paste your video idea or topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Captions'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {loading && <div className="loading">Generating your viral content...</div>}
        {results && (
          <div className="results">
            <h2>Hook Sentence</h2>
            <p>{results.hook}</p>
            <h2>Captions</h2>
            {results.captions.map((caption, index) => (
              <div key={index} className={index > 0 && !unlocked ? 'blurred' : ''}>
                <p>{caption}</p>
                <button onClick={() => copyToClipboard(caption)}>Copy</button>
              </div>
            ))}
            <h2>Hashtags</h2>
            <p className={!unlocked ? 'blurred' : ''}>{results.hashtags.join(' ')}</p>
            {!unlocked && (
              <button onClick={unlockAll}>Unlock all for €2.99</button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
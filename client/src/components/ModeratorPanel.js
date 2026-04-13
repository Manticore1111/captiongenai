import React, { useState } from 'react';
import './ModeratorPanel.css';

const ModeratorPanel = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (username === 'cerberus1' && password === 'cerberus123') {
      setLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  if (!loggedIn) {
    return (
      <div className="moderator-panel">
        <h1>Moderator Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="moderator-panel">
      <h1>Moderator Panel</h1>
      <p>Welcome, Cerberus!</p>
      {/* Add moderator features here */}
    </div>
  );
};

export default ModeratorPanel;
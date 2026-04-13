import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    axios.get('http://localhost:5000/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data));
  }, [navigate]);

  return (
    <div className="profile">
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      <p>XP: {user.xp}</p>
      <p>Level: {user.level}</p>
      <p>Streak: {user.streak}</p>
      <p>Subscription: {user.subscription_status}</p>
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
}

export default Profile;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState({});
  const [challenges, setChallenges] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    axios.get('http://localhost:5000/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data));
    axios.get('http://localhost:5000/api/user/daily-challenges', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setChallenges(res.data.challenges);
        setCompleted(res.data.completed);
      });
  }, [navigate]);

  const completeChallenge = async (id) => {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/user/complete-challenge', { challengeId: id }, { headers: { Authorization: `Bearer ${token}` } });
    setCompleted([...completed, id]);
    setUser({ ...user, xp: res.data.xp, level: res.data.level });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="dashboard">
      {showConfetti && <Confetti />}
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Welcome to MindBoost+, {user.email}!</motion.h1>
      <div className="stats">
        <p>Streak: {user.streak} days</p>
        <p>XP: {user.xp}</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(user.xp % 100) / 100 * 100}%` }}></div>
        </div>
        <p>Level: {user.level}</p>
      </div>
      <div className="buttons">
        <button onClick={() => navigate('/game/memory')}>Play Memory Game</button>
        <button onClick={() => navigate('/game/reaction')}>Play Reaction Game</button>
        <button onClick={() => navigate('/game/pattern')}>Play Pattern Game</button>
        <button onClick={() => navigate('/profile')}>View Profile</button>
        {user.subscription_status !== 'premium' && <button onClick={() => navigate('/payment')}>Upgrade to Premium</button>}
      </div>
      <div className="challenges">
        <h2>Daily Challenges</h2>
        {challenges.map(c => (
          <div key={c.id} className="challenge">
            <p>{c.text} (+{c.xp} XP)</p>
            {completed.includes(c.id) ? <span>Completed</span> : <button onClick={() => completeChallenge(c.id)}>Complete</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
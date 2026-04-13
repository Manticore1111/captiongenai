import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Payment from './components/Payment';
import Game from './components/Game';
import PrivacyPolicy from './components/PrivacyPolicy';
import ModeratorPanel from './components/ModeratorPanel';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/game/:type" element={<Game />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/moderator" element={<ModeratorPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
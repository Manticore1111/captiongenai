import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Game.css';

function Game() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (type === 'memory') {
      const cardValues = ['A', 'A', 'B', 'B', 'C', 'C'];
      setCards(cardValues.sort(() => Math.random() - 0.5));
    }
  }, [type]);

  const handleClick = (index) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) {
      setFlipped([...flipped, index]);
    }
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setScore(score + 10);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped, cards, matched, score]);

  const submitScore = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/games/score', { gameType: type, score }, { headers: { Authorization: `Bearer ${token}` } });
    navigate('/dashboard');
  };

  if (matched.length === cards.length && cards.length > 0) {
    return (
      <div className="game-over">
        <h2>Game Over! Score: {score}</h2>
        <button onClick={submitScore}>Submit Score</button>
      </div>
    );
  }

  return (
    <div className="game">
      <h1>{type} Game</h1>
      <div className="grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''}`}
            onClick={() => handleClick(index)}
          >
            {flipped.includes(index) || matched.includes(index) ? card : '?'}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;
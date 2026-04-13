const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/profile', auth, (req, res) => {
  db.get('SELECT id, email, xp, level, streak, subscription_status FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(user);
  });
});

router.get('/daily-challenges', auth, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  db.get('SELECT * FROM daily_challenges WHERE user_id = ? AND date = ?', [req.user.id, today], (err, row) => {
    if (!row) {
      // Generate new challenges
      const challenges = [
        { id: 1, text: 'Focus for 10 minutes', xp: 10 },
        { id: 2, text: 'Solve a puzzle', xp: 15 },
        { id: 3, text: 'Memory exercise', xp: 20 }
      ];
      db.run('INSERT INTO daily_challenges (user_id, date, challenges) VALUES (?, ?, ?)', [req.user.id, today, JSON.stringify(challenges)], function() {
        res.json({ challenges, completed: [] });
      });
    } else {
      res.json({ challenges: JSON.parse(row.challenges), completed: JSON.parse(row.completed) });
    }
  });
});

router.post('/complete-challenge', auth, (req, res) => {
  const { challengeId } = req.body;
  const today = new Date().toISOString().split('T')[0];
  db.get('SELECT * FROM daily_challenges WHERE user_id = ? AND date = ?', [req.user.id, today], (err, row) => {
    if (!row) return res.status(400).json({ error: 'No challenges for today' });
    const challenges = JSON.parse(row.challenges);
    const completed = JSON.parse(row.completed);
    if (completed.includes(challengeId)) return res.status(400).json({ error: 'Already completed' });
    completed.push(challengeId);
    const challenge = challenges.find(c => c.id === challengeId);
    db.run('UPDATE daily_challenges SET completed = ? WHERE id = ?', [JSON.stringify(completed), row.id]);
    db.run('UPDATE users SET xp = xp + ? WHERE id = ?', [challenge.xp, req.user.id], function() {
      // Check level up
      db.get('SELECT xp FROM users WHERE id = ?', [req.user.id], (err, user) => {
        const newLevel = Math.floor(user.xp / 100) + 1;
        db.run('UPDATE users SET level = ? WHERE id = ?', [newLevel, req.user.id]);
        res.json({ xp: user.xp + challenge.xp, level: newLevel });
      });
    });
  });
});

module.exports = router;
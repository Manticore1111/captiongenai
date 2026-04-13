const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// For simplicity, just record score
router.post('/score', auth, (req, res) => {
  const { gameType, score } = req.body;
  db.run('INSERT INTO game_scores (user_id, game_type, score) VALUES (?, ?, ?)', [req.user.id, gameType, score], function() {
    // Award XP based on score
    const xp = Math.floor(score / 10);
    db.run('UPDATE users SET xp = xp + ? WHERE id = ?', [xp, req.user.id]);
    res.json({ xp });
  });
});

module.exports = router;
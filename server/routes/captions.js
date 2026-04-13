const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Free generate (no auth)
router.post('/free-generate', (req, res) => {
  const { topic, platform } = req.body;

  // Check if free used in session or something, but since no auth, use IP or something, but for simplicity, always allow for now
  // Fake AI generation
  const captions = [
    "Caption 1: This is amazing!",
    "Caption 2: You won't believe this!",
    "Caption 3: Mind blown!",
    "Caption 4: Epic fail!",
    "Caption 5: Life changing!"
  ];
  const hashtags = ["#viral", "#tiktok", "#fyp", "#trending", "#funny", "#amazing", "#wow", "#cool", "#awesome", "#best"];
  const hook = "Hook: Did you know this secret?";

  res.json({ captions, hashtags, hook });
});

// Generate captions
router.post('/generate', verifyToken, (req, res) => {
  const { topic, platform } = req.body;
  const userId = req.user.id;

  // Check if user has free generation left or subscription
  db.get('SELECT free_used, subscription_status FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.free_used && user.subscription_status !== 'active') {
      return res.status(403).json({ message: 'Free generation used. Subscribe to continue.' });
    }

    // Fake AI generation
    const captions = [
      "Caption 1: This is amazing!",
      "Caption 2: You won't believe this!",
      "Caption 3: Mind blown!",
      "Caption 4: Epic fail!",
      "Caption 5: Life changing!"
    ];
    const hashtags = ["#viral", "#tiktok", "#fyp", "#trending", "#funny", "#amazing", "#wow", "#cool", "#awesome", "#best"];
    const hook = "Hook: Did you know this secret?";

    // Save to db
    db.run('INSERT INTO caption_generations (user_id, topic, platform, captions, hashtags, hook) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, topic, platform, JSON.stringify(captions), JSON.stringify(hashtags), hook], (err) => {
        if (err) return res.status(500).json({ message: 'Error saving generation' });

        // Mark free used if not subscribed
        if (!user.free_used) {
          db.run('UPDATE users SET free_used = 1 WHERE id = ?', [userId]);
        }

        res.json({ captions, hashtags, hook });
      });
  });
});

// Get user generations
router.get('/history', verifyToken, (req, res) => {
  const userId = req.user.id;
  db.all('SELECT * FROM caption_generations WHERE user_id = ? ORDER BY date DESC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(rows);
  });
});

module.exports = router;
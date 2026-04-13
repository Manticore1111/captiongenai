const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Rate limiting map per user
const userLastRequest = new Map();
const RATE_LIMIT_MS = 5000; // 5 seconds between requests

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

// Rate limit middleware
const checkRateLimit = (req, res, next) => {
  const userId = req.user.id;
  const now = Date.now();
  const lastRequest = userLastRequest.get(userId) || 0;
  const timeSinceLastRequest = now - lastRequest;

  if (timeSinceLastRequest < RATE_LIMIT_MS) {
    const waitTime = Math.ceil((RATE_LIMIT_MS - timeSinceLastRequest) / 1000);
    return res.status(429).json({ 
      message: `Please wait ${waitTime} seconds before generating captions again.`,
      retryAfter: waitTime 
    });
  }

  userLastRequest.set(userId, now);
  next();
};

// Fallback caption generator (no API needed!)
function generateFallbackCaptions(topic, platform, tone, keywords, count) {
  const captions = [];
  const toneEmojis = {
    funny: '😂',
    inspirational: '🌟',
    professional: '💼',
    casual: '😊',
    urgent: '⚡',
    educational: '📚'
  };
  
  const platformHashtags = {
    tiktok: '#FYP #Viral #TikTok',
    instagram: '#Reels #Explore #Instagram',
    youtube: '#YouTube #Subscribe #Trending',
    twitter: '#Twitter #Trending #X',
    facebook: '#Facebook #Viral #Share',
    linkedin: '#LinkedIn #Professional #Insights'
  };

  const templates = [
    `${toneEmojis[tone]} ${topic} - This will blow your mind! 🤯`,
    `🔥 Just dropped: ${topic} ${platformHashtags[platform] || '#viral'}`,
    `💡 ${topic} - The secret nobody talks about...`,
    `✨ ${topic} ${keywords ? '| ' + keywords : ''} 🎯`,
    `🚀 Why ${topic} is actually genius...`,
    `⭐ ${topic} - Pure magic right here!`,
    `💫 ${topic} | ${tone} edition 🎨`,
    `📱 ${topic} - Don't miss this! 👀`,
    `🎯 ${topic} is everything right now!`,
    `🌟 Here's why ${topic} matters...`,
    `💥 ${topic} hit different today`,
    `🎪 ${topic} - This is insane!`,
    `👑 ${topic} - Main character energy`,
    `🔔 Breaking: ${topic} just changed everything`,
    `💎 ${topic} - Rare and valuable content`
  ];

  for (let i = 0; i < count; i++) {
    captions.push(templates[i % templates.length]);
  }

  return captions;
}

// Free generate (no auth)
router.post('/free-generate', (req, res) => {
  const { topic, platform, tone = 'casual', keywords, count = 5 } = req.body;

  // Generate fallback captions (no API calls)
  const captions = generateFallbackCaptions(topic, platform, tone, keywords, parseInt(count));
  const hashtags = ["#viral", "#trending", "#fyp", "#explore", "#content", "#creator"];
  const hook = `✨ ${topic} - You have to see this!`;

  res.json({ captions, hashtags, hook, source: 'generated' });
});

// Generate captions (with rate limiting and fallback)
router.post('/generate', verifyToken, checkRateLimit, (req, res) => {
  const { topic, platform, tone = 'casual', keywords, count = 5 } = req.body;
  const userId = req.user.id;

  if (!topic) {
    return res.status(400).json({ message: 'Topic is required' });
  }

  // Check user subscription and free trials
  db.get('SELECT free_trials_remaining, subscription_status FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      // Generate fallback on DB error
      const captions = generateFallbackCaptions(topic, platform, tone, keywords, parseInt(count));
      return res.json({ 
        captions, 
        hashtags: ["#viral", "#trending", "#content"],
        hook: `✨ ${topic} - Amazing content!`,
        source: 'fallback'
      });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has active subscription
    const hasSubscription = user.subscription_status === 'active' || user.subscription_status === 'pro' || user.subscription_status === 'business';

    // Check free trials
    if (!hasSubscription && user.free_trials_remaining <= 0) {
      return res.status(403).json({ 
        message: 'Free trials exhausted. Please subscribe to continue.',
        error: 'NO_TRIALS_LEFT',
        redirect: '/upgrade.html'
      });
    }

    // Generate captions
    const captions = generateFallbackCaptions(topic, platform, tone, keywords, parseInt(count));
    const hashtags = ["#viral", "#trending", "#fyp", "#explore", "#content", "#creator"];
    const hook = `✨ ${topic} - Amazing content for ${platform}!`;

    // Save to database
    db.run(
      'INSERT INTO caption_generations (user_id, topic, platform, captions, hashtags, hook) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, topic, platform, JSON.stringify(captions), JSON.stringify(hashtags), hook],
      (err) => {
        if (!err && !hasSubscription) {
          // Decrement free trials
          const trialsRemaining = user.free_trials_remaining - 1;
          db.run('UPDATE users SET free_trials_remaining = ?, free_trials_used = ? WHERE id = ?', 
            [trialsRemaining, user.free_trials_used + 1, userId]);
          
          return res.json({ 
            captions, 
            hashtags, 
            hook,
            source: 'generated',
            message: `Generation #${user.free_trials_used + 1}/3 done! Trials left: ${trialsRemaining}`,
            trials_remaining: trialsRemaining
          });
        }

        // For paid users or if DB save failed
        res.json({ 
          captions, 
          hashtags, 
          hook,
          source: 'generated',
          message: 'Captions generated successfully!'
        });
      }
    );
  });
});

// Get user subscription status
router.get('/subscription-status', verifyToken, (req, res) => {
  const userId = req.user.id;
  
  db.get(
    'SELECT subscription_status, subscription_plan, free_used FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.json({ 
          status: 'free', 
          plan: 'free',
          message: 'No subscription found'
        });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        status: user.subscription_status || 'free',
        plan: user.subscription_plan || 'free',
        free_used: user.free_used,
        has_access: user.subscription_status === 'active'
      });
    }
  );
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
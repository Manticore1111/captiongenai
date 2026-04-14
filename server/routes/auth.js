const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Configure nodemailer - will be initialized in routes
let transporter = null;

function getTransporter() {
  if (!transporter) {
    try {
      transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: process.env.GMAIL_USER || 'your-email@outlook.com',
          pass: process.env.GMAIL_PASS || 'your-password'
        }
      });
    } catch (err) {
      console.error('Nodemailer init error:', err);
      transporter = null;
    }
  }
  return transporter;
}

router.post('/register', async (req, res) => {
  const { email, password, name, phone, country } = req.body;
  console.log('📝 Registration attempt for:', email);
  
  // Validation
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, name, and password required' });
  }
  
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const joinDate = new Date().toLocaleDateString();

  // Save to database
  db.run(
    `INSERT INTO users (email, password, name, phone, country, subscription_status, created_at) 
     VALUES (?, ?, ?, ?, ?, 'free', CURRENT_TIMESTAMP)`,
    [email, hashedPassword, name, phone || '', country || ''],
    function(err) {
      if (err) {
        console.log('❌ Registration error:', err.message);
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Email is already registered' });
        }
        return res.status(400).json({ error: 'Registration failed' });
      }
      
      const userId = this.lastID;
      console.log('✅ User registered successfully:', email, '(ID:', userId, ')');

      // Create JWT token
      const token = jwt.sign({ id: userId, email }, JWT_SECRET);

      // Return user data
      const userData = {
        id: userId,
        name,
        email,
        phone: phone || '',
        country: country || '',
        plan: 'free',
        captionsGenerated: 0,
        joinDate,
        subscription_status: 'free'
      };

      // Send notification email
      const mailOptions = {
        from: process.env.GMAIL_USER || 'your-email@outlook.com',
        to: process.env.GMAIL_USER || 'your-email@outlook.com',
        subject: 'New User Registration on Caption AI 🚀',
        html: `
          <h2>Nieuwe registratie! 🎉</h2>
          <p><strong>Naam:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Tijd:</strong> ${new Date().toLocaleString('nl-NL')}</p>
          <hr>
          <p>Iemand heeft zich zojuist geregistreerd op je Caption AI app!</p>
        `
      };
      
      const emailTransporter = getTransporter();
      if (emailTransporter) {
        emailTransporter.sendMail(mailOptions, (error) => {
          if (error) console.log('❌ Registration email error:', error);
          else console.log('✅ Registration email sent');
        });
      }

      // Return success
      res.status(201).json({ 
        success: true,
        token, 
        user: userData,
        message: 'Registration successful! You are now logged in.' 
      });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password, country, ip_address } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Check database for user
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.log('❌ Database error:', err.message);
      return res.status(500).json({ error: 'Server error' });
    }

    // User not found
    if (!user) {
      console.log('❌ Login failed: User not found -', email);
      return res.status(401).json({ 
        error: 'Invalid email or password. User not registered.',
        success: false 
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('❌ Login failed: Wrong password -', email);
      return res.status(401).json({ 
        error: 'Invalid email or password.',
        success: false 
      });
    }

    // Password correct - generate token
    console.log('✅ Login successful:', email);
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    // Update last_login, streak, country, and IP
    const today = new Date().toISOString().split('T')[0];
    if (user.last_login !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yestStr = yesterday.toISOString().split('T')[0];
      const newStreak = user.last_login === yestStr ? user.streak + 1 : 1;
      db.run('UPDATE users SET last_login = ?, streak = ? WHERE id = ?', [today, newStreak, user.id]);
    }

    // Save country and IP address from login
    if (country || ip_address) {
      db.run('UPDATE users SET country = ?, ip_address = ?, last_login_country = ? WHERE id = ?', 
        [country || user.country || '', ip_address || '', country || '', user.id],
        (updateErr) => {
          if (updateErr) console.log('⚠️ Could not save country/IP:', updateErr.message);
          else console.log('🌍 Country saved:', country, '| IP:', ip_address);
        }
      );
    }

    // Return user data
    const userData = {
      id: user.id,
      name: user.name || 'User',
      email: user.email,
      phone: user.phone || '',
      country: country || user.country || '',
      ip_address: ip_address || user.ip_address || '',
      last_login_country: country || user.last_login_country || '',
      plan: user.subscription_status || 'free',
      captionsGenerated: user.captionsGenerated || 0,
      joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
      subscription_status: user.subscription_status || 'free'
    };

    res.json({ 
      success: true,
      token, 
      user: userData,
      message: 'Login successful!' 
    });
  });
});

// Test route voor mail
router.get('/test-email', (req, res) => {
  console.log('🔍 Test email route reached');
  console.log('GMAIL_USER:', process.env.GMAIL_USER);
  console.log('GMAIL_PASS exists:', !!process.env.GMAIL_PASS);
  
  const mailOptions = {
    from: process.env.GMAIL_USER || 'your-email@outlook.com',
    to: process.env.GMAIL_USER || 'your-email@outlook.com',
    subject: 'Test Email - Caption AI ✅',
    html: `
      <h2>Test Mail Succesvol! ✅</h2>
      <p>Dit is een test email van je Caption AI app.</p>
      <p>Je Outlook configuratie werkt goed!</p>
      <p>Wanneer iemand zich registreert, ontvang je hier een notificatie.</p>
      <hr>
      <p><small>Verzonden op: ${new Date().toLocaleString('nl-NL')}</small></p>
    `
  };
  
  const emailTransporter = getTransporter();
  console.log('📧 Transporter initialized:', !!emailTransporter);
  
  if (!emailTransporter) {
    console.log('❌ Transporter is null - configuration failed');
    return res.status(500).json({ error: 'Email service not configured' });
  }
  
  emailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('❌ Email error:', error);
      res.status(500).json({ error: 'Email failed', details: error.message });
    } else {
      console.log('✅ Test email sent:', info.response);
      res.json({ success: 'Test email sent successfully!' });
    }
  });
});

module.exports = router;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const ADMIN_EMAIL = 'mofik.kalinci@hotmail.com';

// ============================================
// MIDDLEWARE: Verify Admin Token
// ============================================
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Geen toegang. Log in als admin.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Geen admin rechten.' });
    }

    req.adminId = decoded.id;
    req.adminEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Ongeldige of verlopen token.' });
  }
}

// ============================================
// POST /api/admin/login
// ============================================
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('🔐 Admin login poging:', username);

  if (!username || !password) {
    return res.status(400).json({ error: 'Gebruikersnaam en wachtwoord verplicht.' });
  }

  // Hardcoded admin credentials check
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = '123456789M';

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    console.log('❌ Ongeldige admin login poging:', username);
    return res.status(401).json({ error: 'Ongeldige gebruikersnaam of wachtwoord.' });
  }

  console.log('✅ Admin login geslaagd');

  // Genereer admin token
  const token = jwt.sign(
    { id: 0, username: ADMIN_USERNAME, isAdmin: true },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token,
    admin: {
      id: 0,
      name: 'Admin',
      username: ADMIN_USERNAME,
      role: 'admin'
    },
    message: 'Admin login geslaagd!'
  });
});

// ============================================
// GET /api/admin/dashboard - Dashboard statistieken
// ============================================
router.get('/dashboard', verifyAdmin, (req, res) => {
  console.log('📊 Admin dashboard data ophalen...');

  const stats = {};

  // Totaal gebruikers
  db.get('SELECT COUNT(*) as total FROM users WHERE role != "admin"', [], (err, row) => {
    stats.totalUsers = row ? row.total : 0;

    // Gebruikers met gratis trials op
    db.get('SELECT COUNT(*) as total FROM users WHERE free_trials_remaining = 0 AND role != "admin"', [], (err2, row2) => {
      stats.trialsExhausted = row2 ? row2.total : 0;

      // Gebruikers vandaag geregistreerd
      const today = new Date().toISOString().split('T')[0];
      db.get('SELECT COUNT(*) as total FROM users WHERE DATE(created_at) = ? AND role != "admin"', [today], (err3, row3) => {
        stats.registeredToday = row3 ? row3.total : 0;

        // Actieve subscriptions
        db.get('SELECT COUNT(*) as total FROM users WHERE subscription_status != "free" AND role != "admin"', [], (err4, row4) => {
          stats.activeSubscriptions = row4 ? row4.total : 0;

          // Gebruikers per land
          db.all('SELECT country, COUNT(*) as count FROM users WHERE country IS NOT NULL AND country != "" AND role != "admin" GROUP BY country ORDER BY count DESC LIMIT 10', [], (err5, countries) => {
            stats.countriesBreakdown = countries || [];

            // Vandaag ingelogd
            db.get('SELECT COUNT(*) as total FROM users WHERE DATE(last_login) = ? AND role != "admin"', [today], (err6, row6) => {
              stats.loggedInToday = row6 ? row6.total : 0;

              console.log('📊 Dashboard stats:', stats);
              res.json({ success: true, stats });
            });
          });
        });
      });
    });
  });
});

// ============================================
// GET /api/admin/users - Alle gebruikers ophalen
// ============================================
router.get('/users', verifyAdmin, (req, res) => {
  console.log('👥 Admin: Alle gebruikers ophalen...');

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  let query = `SELECT id, name, email, phone, country, ip_address, last_login_country, 
               subscription_status, subscription_plan, free_trials_remaining, free_trials_used,
               streak, xp, level, last_login, created_at, role
               FROM users WHERE role != "admin"`;
  let countQuery = `SELECT COUNT(*) as total FROM users WHERE role != "admin"`;
  let params = [];

  // Zoek filter
  if (search) {
    query += ` AND (name LIKE ? OR email LIKE ? OR country LIKE ? OR ip_address LIKE ?)`;
    countQuery += ` AND (name LIKE ? OR email LIKE ? OR country LIKE ? OR ip_address LIKE ?)`;
    const searchParam = `%${search}%`;
    params = [searchParam, searchParam, searchParam, searchParam];
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;

  // Eerst totaal tellen
  db.get(countQuery, params, (err, countRow) => {
    const total = countRow ? countRow.total : 0;

    // Dan gebruikers ophalen
    db.all(query, [...params, limit, offset], (err2, users) => {
      if (err2) {
        console.log('❌ Error:', err2.message);
        return res.status(500).json({ error: 'Server fout.' });
      }

      console.log(`👥 ${users ? users.length : 0} gebruikers opgehaald (pagina ${page})`);

      res.json({
        success: true,
        users: users || [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    });
  });
});

// ============================================
// GET /api/admin/users/:id - Specifieke gebruiker
// ============================================
router.get('/users/:id', verifyAdmin, (req, res) => {
  const userId = req.params.id;

  db.get('SELECT id, name, email, phone, country, ip_address, last_login_country, subscription_status, subscription_plan, free_trials_remaining, free_trials_used, streak, xp, level, last_login, created_at FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) return res.status(500).json({ error: 'Server fout.' });
    if (!user) return res.status(404).json({ error: 'Gebruiker niet gevonden.' });

    res.json({ success: true, user });
  });
});

// ============================================
// DELETE /api/admin/users/:id - Gebruiker verwijderen
// ============================================
router.delete('/users/:id', verifyAdmin, (req, res) => {
  const userId = req.params.id;

  db.run('DELETE FROM users WHERE id = ? AND role != "admin"', [userId], function(err) {
    if (err) return res.status(500).json({ error: 'Server fout.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Gebruiker niet gevonden of is admin.' });

    console.log('🗑️ Gebruiker verwijderd:', userId);
    res.json({ success: true, message: 'Gebruiker verwijderd.' });
  });
});

// ============================================
// PUT /api/admin/users/:id - Gebruiker bewerken
// ============================================
router.put('/users/:id', verifyAdmin, (req, res) => {
  const userId = req.params.id;
  const { subscription_status, free_trials_remaining } = req.body;

  db.run('UPDATE users SET subscription_status = ?, free_trials_remaining = ? WHERE id = ? AND role != "admin"',
    [subscription_status, free_trials_remaining, userId],
    function(err) {
      if (err) return res.status(500).json({ error: 'Server fout.' });
      if (this.changes === 0) return res.status(404).json({ error: 'Gebruiker niet gevonden.' });

      console.log('✏️ Gebruiker bijgewerkt:', userId);
      res.json({ success: true, message: 'Gebruiker bijgewerkt.' });
    }
  );
});

module.exports = router;

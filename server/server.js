require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const gamesRoutes = require('./routes/games');
const paymentsRoutes = require('./routes/payments');
const captionsRoutes = require('./routes/captions');
const adminRoutes = require('./routes/admin');
const db = require('./db');
const bcrypt = require('bcryptjs');

// Seed test user
const hashed = bcrypt.hashSync('password', 10);
db.run('INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)', ['test@example.com', hashed]);

// Seed admin account
const adminHash = bcrypt.hashSync('123456789M', 10);
db.run('INSERT OR IGNORE INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', 
  ['mofik.kalinci@hotmail.com', adminHash, 'Admin', 'admin'],
  (err) => {
    if (err) console.log('Admin seed info:', err.message);
    else console.log('✅ Admin account klaar: mofik.kalinci@hotmail.com');
  }
);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Servir arquivos estáticos da pasta standalone
app.use('/standalone', express.static(path.join(__dirname, '../standalone')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/captions', captionsRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
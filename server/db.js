const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mindboost.db');

db.serialize(() => {
  // Create tables
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    country TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    last_login DATE,
    subscription_status TEXT DEFAULT 'free',
    subscription_end_date DATE,
    free_used BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Add missing columns to existing tables (migration)
  db.all(`PRAGMA table_info(users)`, (err, columns) => {
    if (columns) {
      const columnNames = columns.map(c => c.name);
      
      // Add name column if missing
      if (!columnNames.includes('name')) {
        db.run(`ALTER TABLE users ADD COLUMN name TEXT`);
      }
      
      // Add phone column if missing
      if (!columnNames.includes('phone')) {
        db.run(`ALTER TABLE users ADD COLUMN phone TEXT`);
      }
      
      // Add country column if missing
      if (!columnNames.includes('country')) {
        db.run(`ALTER TABLE users ADD COLUMN country TEXT`);
      }
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS daily_challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date DATE,
    challenges TEXT,
    completed TEXT DEFAULT '[]',
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS game_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    game_type TEXT,
    score INTEGER,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS caption_generations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    topic TEXT,
    platform TEXT,
    captions TEXT,
    hashtags TEXT,
    hook TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
});

module.exports = db;
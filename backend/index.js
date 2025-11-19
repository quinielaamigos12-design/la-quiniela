const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_PATH = path.join(__dirname, 'quiniela.db');
const db = new sqlite3.Database(DB_PATH);

// Initialize DB tables if not exist
const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');
db.exec(initSql, (err) => {
  if(err) console.error('DB init error', err);
  else console.log('DB initialized');
});

// Simple auth (demo): login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT id, username, is_admin FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if(err) return res.status(500).json({ error: 'DB error' });
    if(!row) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ id: row.id, username: row.username, is_admin: !!row.is_admin });
  });
});

// Get jornadas list
app.get('/api/jornadas', (req, res) => {
  db.all('SELECT id, title, date FROM jornadas ORDER BY id', (err, rows) => {
    if(err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// Get matches for a jornada
app.get('/api/jornadas/:id/matches', (req, res) => {
  const jid = req.params.id;
  db.all('SELECT id, home, away, match_no FROM matches WHERE jornada_id = ? ORDER BY match_no', [jid], (err, rows) => {
    if(err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// Save pronostico
app.post('/api/jornadas/:id/pronosticos', (req, res) => {
  const jid = req.params.id;
  const { user_id, predictions } = req.body; // predictions = [{match_no, pick}]
  const stmt = db.prepare('INSERT OR REPLACE INTO pronosticos (jornada_id, user_id, match_no, pick) VALUES (?,?,?,?)');
  db.serialize(() => {
    predictions.forEach(p => stmt.run(jid, user_id, p.match_no, p.pick));
    stmt.finalize();
    res.json({ ok: true });
  });
});

// Serve frontend static if built
app.use('/', express.static(path.join(__dirname, '..', 'frontend', 'dist')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server listening on', PORT));

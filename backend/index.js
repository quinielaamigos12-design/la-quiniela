
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(path.join(__dirname, 'quiniela.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  );`);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(
    `SELECT * FROM users WHERE username=? AND password=?`,
    [username, password],
    (err, row) => {
      if (row) return res.json({ success: true, role: row.role });
      return res.status(401).json({ success: false, msg: "Usuario o contraseña inválidos" });
    }
  );
});

app.listen(4000, () => console.log("Backend listo en http://localhost:4000"));

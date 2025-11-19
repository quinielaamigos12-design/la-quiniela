PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  email TEXT,
  is_admin INTEGER DEFAULT 0,
  points INTEGER DEFAULT 50
);
CREATE TABLE IF NOT EXISTS jornadas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  date TEXT
);
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jornada_id INTEGER,
  match_no INTEGER,
  home TEXT,
  away TEXT,
  result TEXT,
  FOREIGN KEY (jornada_id) REFERENCES jornadas(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS pronosticos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jornada_id INTEGER,
  user_id INTEGER,
  match_no INTEGER,
  pick TEXT,
  UNIQUE(jornada_id, user_id, match_no),
  FOREIGN KEY (jornada_id) REFERENCES jornadas(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
COMMIT;

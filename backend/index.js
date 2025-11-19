require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------
// VALIDAR DATABASE_URL
// ---------------------
if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL no está configurada");
  process.exit(1);
}

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

// ---------------------
// INICIALIZAR BASE DE DATOS
// ---------------------
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre TEXT,
        email TEXT UNIQUE,
        password TEXT,
        activo BOOLEAN DEFAULT TRUE,
        rol TEXT DEFAULT 'user',
        fecha_reg TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS jornadas (
        id SERIAL PRIMARY KEY,
        num_jornada INTEGER,
        temporada TEXT,
        created TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS partidos (
        id SERIAL PRIMARY KEY,
        jornada_id INTEGER REFERENCES jornadas(id),
        equipo1 TEXT,
        equipo2 TEXT,
        resultado TEXT,
        orden INTEGER
      );
    `);

    console.log("DB init OK");
  } catch (err) {
    console.error("Init DB failed:", err);
  }
}

// ---------------------
// ROUTES
// ---------------------
app.get('/api/ping', (req, res) => {
  res.json({ ok: true });
});

// ---------------------
// PORT CORRECTO PARA RAILWAY
// ---------------------
const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0',() => {
  console.log("Server listening on", PORT);
  try {
    await initDb();
  } catch (err) {
    console.error("Init DB failed:", err);
  }
});

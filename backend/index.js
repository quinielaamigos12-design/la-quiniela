require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const DATABASE_URL = process.env.DATABASE_URL || '';
if(!DATABASE_URL){
  console.error("ERROR: DATABASE_URL no está definido. En Railway la variable DATABASE_URL la proporciona Railway.");
}
const pool = new Pool({ connectionString: DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });

// Crear tablas e insertar admin + usuarios si no existen
async function initDb(){
  const client = await pool.connect();
  try{
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'player'
      );
    `);

    const res = await client.query(`SELECT COUNT(*) AS cnt FROM users;`);
    const cnt = parseInt(res.rows[0].cnt, 10);
    if(cnt === 0){
      console.log("Insertando ADMIN y usuarios de ejemplo...");
      // ADMIN credentials from user: ADMIN / ADMIN123
      const adminPass = await bcrypt.hash(process.env.ADMIN_PASSWORD || "ADMIN123", 10);
      await client.query('INSERT INTO users(username, password, role) VALUES($1,$2,$3) ON CONFLICT DO NOTHING', ['ADMIN', adminPass, 'admin']);

      // Additional sample users (from provided file - minimal demo list)
      const sample = [
        'MIGUI','PEPE','JUAN','MARIA','ANA','CARLOS','DAVID','LUIS','ALBERTO','PABLO',
        'JORGE','FRAN','RAUL','ISRA','RAFA','ALBA','LAURA','SARA','ANDRE','MARTA',
        'IGNACIO','ALVARO','SERGIO','DIEGO','ESTHER','ALEJANDRO','NICO','ROBERTO','CRIS','TOMAS',
        'LOLA','KARLOS'
      ];
      for(const u of sample){
        const p = await bcrypt.hash(u + "123", 10); // simple default password per user: username + "123"
        await client.query('INSERT INTO users(username,password,role) VALUES($1,$2,$3) ON CONFLICT DO NOTHING', [u, p, 'player']);
      }
      console.log("Usuarios insertados.");
    } else {
      console.log("Users table already has data, skipping initial insert.");
    }
  }catch(err){
    console.error("Error inicializando DB:", err.message);
  }finally{
    client.release();
  }
}

// Simple login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ success:false, msg: "username y password requeridos" });
  try{
    const r = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
    if(r.rows.length === 0) return res.status(401).json({ success:false, msg: "Usuario o contraseña inválidos" });
    const user = r.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(401).json({ success:false, msg: "Usuario o contraseña inválidos" });
    return res.json({ success:true, role: user.role, username: user.username });
  }catch(err){
    console.error("Login error:", err);
    return res.status(500).json({ success:false, msg: "Error interno" });
  }
});

app.get('/api/ping', (req,res) => res.json({ ok:true }));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log('Server listening on', PORT);
  try{
    await initDb();
  }catch(err){
    console.error("Init DB failed:", err);
  }
});

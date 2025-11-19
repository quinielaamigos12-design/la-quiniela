// Node script example to parse simple 'jornadas' from data/original_input.txt and insert into DB.
// Run: node import_example.js (from backend/)
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path.join(__dirname, 'quiniela.db'));
const data = fs.readFileSync(path.join(__dirname, '..', 'data', 'original_input.txt'), 'utf-8');

// This example is intentionally simple and looks for lines like "Jornada 1" and dates in yyyy-mm-dd or dd/mm/yyyy
const jornadaRegex = /Jornada\s*\d+[^\n]*\-\s*(\d{2}\/\d{2}\/\d{4})/gi;
let m;
db.serialize(()=>{
  while((m = jornadaRegex.exec(data)) !== null){
    const title = m[0].split('\n')[0].trim();
    const date = m[1];
    db.run('INSERT INTO jornadas (title, date) VALUES (?, ?)', [title, date]);
  }
  console.log('Import finished (example).');
});

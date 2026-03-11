const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(process.env.SQLITE_FILE);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL
  )`);
});

module.exports = db;
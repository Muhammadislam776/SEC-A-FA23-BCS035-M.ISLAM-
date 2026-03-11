const express = require("express");
const router = express.Router();

const mysqlDB = require("../db/mysql");    // MySQL connection
const sqliteDB = require("../db/sqlite");  // SQLite connection
const MongoItem = require("../db/mongodb"); // Mongoose model

let activeDB = "mysql"; // default DB

// --------------------------
// CREATE TABLES IF MISSING
// --------------------------

// MySQL: create items table if it doesn't exist
mysqlDB.query(
  `CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL
  )`,
  (err) => {
    if (err) console.error("MySQL Table creation error:", err);
    else console.log("MySQL items table ready!");
  }
);

// SQLite: create items table if it doesn't exist
sqliteDB.run(
  `CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL
  )`,
  (err) => {
    if (err) console.error("SQLite Table creation error:", err);
    else console.log("SQLite items table ready!");
  }
);

// --------------------------
// SET ACTIVE DATABASE
// --------------------------
router.post("/set-db", (req, res) => {
  const { dbType } = req.body;
  if (!["mysql", "sqlite", "mongodb"].includes(dbType)) {
    return res.status(400).json({ error: "Invalid DB type" });
  }
  activeDB = dbType;
  res.json({ message: `Database switched to ${dbType}` });
});

// --------------------------
// GET ALL ITEMS
// --------------------------
router.get("/", async (req, res) => {
  try {
    if (activeDB === "mysql") {
      const [rows] = await mysqlDB.query("SELECT * FROM items");
      res.json(rows);
    } else if (activeDB === "sqlite") {
      sqliteDB.all("SELECT * FROM items", (err, rows) => {
        if (err) throw err;
        res.json(rows);
      });
    } else {
      const items = await MongoItem.find();
      res.json(items);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------
// ADD NEW ITEM
// --------------------------
router.post("/", async (req, res) => {
  const { name, description, price } = req.body;

  try {
    if (activeDB === "mysql") {
      await mysqlDB.query(
        "INSERT INTO items (name, description, price) VALUES (?, ?, ?)",
        [name, description, price]
      );
      res.json({ message: "Item added (MySQL)" });
    } else if (activeDB === "sqlite") {
      sqliteDB.run(
        "INSERT INTO items (name, description, price) VALUES (?, ?, ?)",
        [name, description, price],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Item added (SQLite)", id: this.lastID });
        }
      );
    } else {
      const newItem = new MongoItem({ name, description, price });
      await newItem.save();
      res.json({ message: "Item added (MongoDB)" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------
// UPDATE ITEM
// --------------------------
router.put("/:id", async (req, res) => {
  const { name, description, price } = req.body;
  const id = req.params.id;

  try {
    if (activeDB === "mysql") {
      await mysqlDB.query(
        "UPDATE items SET name=?, description=?, price=? WHERE id=?",
        [name, description, price, id]
      );
      res.json({ message: "Item updated (MySQL)" });
    } else if (activeDB === "sqlite") {
      sqliteDB.run(
        "UPDATE items SET name=?, description=?, price=? WHERE id=?",
        [name, description, price, id],
        function (err) {
          if (err) return res.status(500).json(err);
          res.json({ message: "Item updated (SQLite)" });
        }
      );
    } else {
      await MongoItem.findByIdAndUpdate(id, { name, description, price });
      res.json({ message: "Item updated (MongoDB)" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// --------------------------
// DELETE ITEM
// --------------------------
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    if (activeDB === "mysql") {
      await mysqlDB.query("DELETE FROM items WHERE id=?", [id]);
      res.json({ message: "Item deleted (MySQL)" });
    } else if (activeDB === "sqlite") {
      sqliteDB.run("DELETE FROM items WHERE id=?", [id], function (err) {
        if (err) return res.status(500).json(err);
        res.json({ message: "Item deleted (SQLite)" });
      });
    } else {
      await MongoItem.findByIdAndDelete(id);
      res.json({ message: "Item deleted (MongoDB)" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
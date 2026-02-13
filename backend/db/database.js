const sqlite3 = require("sqlite3").verbose()
const path = require("path")

const dbPath = path.resolve(__dirname, "../controlplane.db")

const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      storeName TEXT UNIQUE,
      userId TEXT,
      engine TEXT,
      namespace TEXT,
      status TEXT,
      url TEXT,
      errorMessage TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      durationMs INTEGER
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      storeName TEXT,
      action TEXT,
      status TEXT,
      timestamp TEXT,
      durationMs INTEGER
    )
  `)
})

module.exports = db

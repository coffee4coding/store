// const { activityLog } = require("../data/store.memory")

// function logActivity(entry) {
//   activityLog.push({
//     ...entry,
//     timestamp: new Date()
//   })
// }

// module.exports = {
//   logActivity
// }

const db = require("../db/database")

function logActivity({
  storeName,
  action,
  status,
  durationMs = null
}) {
  const timestamp = new Date().toISOString()

  db.run(
    `INSERT INTO activity_logs (storeName, action, status, timestamp, durationMs)
     VALUES (?, ?, ?, ?, ?)`,
    [storeName, action, status, timestamp, durationMs]
  )
}

module.exports = { logActivity }


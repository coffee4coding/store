const express = require("express")
const cors = require("cors")

require("./db/database")   //← Added THIS LINE he database file is only created when database.js is actually required (loaded) by your server.

// Right now, you only created db/database.js,
// but you have NOT yet imported it anywhere in server.js or routes.

// So Node never executed this line:

// const db = new sqlite3.Database(dbPath)

//  And therefore the file was never created."

const storeRoutes = require("./routes/stores.routes")

const app = express()
app.use(cors())
app.use(express.json())

app.use("/stores", storeRoutes)

app.listen(5000, () => {
  console.log("Provisioning API running on port 5000")
})

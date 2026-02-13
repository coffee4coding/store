// const express = require("express")
// const router = express.Router()

// const db = require("../db/database")
// // const { stores } = require("../data/store.memory")
// const { metrics, getMetrics } = require("../services/metrics.service")
// const { logActivity } = require("../services/audit.service")
// const { queueProvision } = require("../services/provisioning.service")
// const execCommand = require("../utils/exec.util")

// // CREATE STORE
// // router.post("/", (req, res) => {
// //   const { storeName, userId } = req.body

// //   if (!storeName || !userId) {
// //     return res.status(400).json({ error: "storeName and userId required" })
// //   }

// //   const existing = stores.find(s => s.storeName === storeName)
// //   if (existing) {
// //     return res.status(400).json({ error: "Store already exists" })
// //   }

// //   const userStoreCount = stores.filter(s => s.userId === userId).length
// //   if (userStoreCount >= 3) {
// //     return res.status(403).json({ error: "Store limit reached (max 3 per user)" })
// //   }

// //   const store = {
// //     storeName,
// //     userId,
// //     namespace: storeName,
// //     status: "PROVISIONING",
// //     createdAt: new Date(),
// //     durationMs: null,
// //     errorMessage: null
// //   }

// //   stores.push(store)
// //   metrics.totalCreated++

// //   queueProvision(store)

// //   res.json({
// //     storeName,
// //     status: "PROVISIONING",
// //     url: `http://${storeName}.local`
// //   })
// // })

// router.post("/", (req, res) => {
//   const { storeName, userId, engine } = req.body


//   if (!storeName || !userId) {
//     return res.status(400).json({ error: "storeName and userId required" })
//   }

//   db.get(
//     "SELECT * FROM stores WHERE storeName = ?",
//     [storeName],
//     (err, row) => {
//       if (row) {
//         return res.status(400).json({ error: "Store already exists" })
//       }

//       db.get(
//         "SELECT COUNT(*) as count FROM stores WHERE userId = ?",
//         [userId],
//         (err, result) => {
//           if (result.count >= 3) {
//             return res.status(403).json({ error: "Store limit reached (max 3 per user)" })
//           }

//           const now = new Date().toISOString()
//           // const url = `http://${storeName}.local`
//           const url = `http://${storeName}.127.0.0.1.nip.io`


//           db.run(
//   `INSERT INTO stores (storeName, userId, engine, namespace, status, url, createdAt, updatedAt)
//    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//   [storeName, userId, engine || "woocommerce", storeName, "PROVISIONING", url, now, now],
//   function (err) {
//     if (err) {
//       return res.status(500).json({ error: err.message })
//     }

//     metrics.totalCreated++

//     queueProvision({
//       storeName,
//       namespace: storeName,
//       url,
//       engine: engine || "woocommerce"
//     })

//     res.json({
//       storeName,
//       status: "PROVISIONING",
//       url
//     })
//   }
// )


// // LIST STORES
// // router.get("/", (req, res) => {
// //   res.json(stores)
// // })
// router.get("/", (req, res) => {
//   db.all("SELECT * FROM stores", [], (err, rows) => {
//     if (err) {
//       return res.status(500).json({ error: err.message })
//     }
//     res.json(rows)
//   })
// })



// // DELETE STORE
// // router.delete("/:storeName", async (req, res) => {
// //   const { storeName } = req.params

// //   const index = stores.findIndex(s => s.storeName === storeName)
// //   if (index === -1) {
// //     return res.status(404).json({ error: "Store not found" })
// //   }

// //   try {
// //     await execCommand(`helm uninstall ${storeName} -n ${storeName}`)
// //     await execCommand(`kubectl delete namespace ${storeName}`)

// //     metrics.totalDeleted++

// //     logActivity({
// //       storeName,
// //       action: "DELETE",
// //       status: "SUCCESS"
// //     })

// //     stores.splice(index, 1)

// //     res.json({ message: "Store deleted successfully" })

// //   } catch (err) {
// //     res.status(500).json({ error: err.toString() })
// //   }
// // })
// router.delete("/:storeName", async (req, res) => {
//   const { storeName } = req.params

//   db.get(
//     "SELECT * FROM stores WHERE storeName = ?",
//     [storeName],
//     async (err, row) => {
//       if (!row) {
//         return res.status(404).json({ error: "Store not found" })
//       }

//       try {
//         await execCommand(`helm uninstall ${storeName} -n ${storeName}`)
//       } catch (e) {}

//       try {
//         await execCommand(`kubectl delete namespace ${storeName}`)
//       } catch (e) {}

//       metrics.totalDeleted++

//       logActivity({
//         storeName,
//         action: "DELETE",
//         status: "SUCCESS"
//       })

//       db.run("DELETE FROM stores WHERE storeName = ?", [storeName])

//       res.json({ message: "Store deleted successfully" })
//     }
//   )
// })



// // METRICS
// // router.get("/metrics", (req, res) => {
// //   res.json(getMetrics(stores.length))
// // })
// router.get("/metrics", (req, res) => {
//   db.get("SELECT COUNT(*) as count FROM stores", [], (err, result) => {
//     res.json(getMetrics(result.count))
//   })
// })



// // ACTIVITY
// // router.get("/activity", (req, res) => {
// //   // const { activityLog } = require("../data/store.memory")
// //   res.json(activityLog)
// // })
// router.get("/activity", (req, res) => {
//   db.all("SELECT * FROM activity_logs ORDER BY timestamp DESC", [], (err, rows) => {
//     res.json(rows)
//   })
// })

// module.exports = router

const express = require("express")
const router = express.Router()

const db = require("../db/database")
const { metrics, getMetrics } = require("../services/metrics.service")
const { logActivity } = require("../services/audit.service")
const { queueProvision } = require("../services/provisioning.service")
const execCommand = require("../utils/exec.util")

// ==========================
// CREATE STORE
// ==========================
router.post("/", (req, res) => {
  const { storeName, userId, engine } = req.body

  console.log("Selected engine:", engine)

  if (!storeName || !userId) {
    return res.status(400).json({ error: "storeName and userId required" })
  }

  db.get(
    "SELECT * FROM stores WHERE storeName = ?",
    [storeName],
    (err, existingStore) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      if (existingStore) {
        return res.status(400).json({ error: "Store already exists" })
      }

      db.get(
        "SELECT COUNT(*) as count FROM stores WHERE userId = ?",
        [userId],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message })
          }

          if (result.count >= 3) {
            return res.status(403).json({
              error: "Store limit reached (max 3 per user)"
            })
          }

          const now = new Date().toISOString()
          const selectedEngine = engine || "woocommerce"
          const url = `http://${storeName}.127.0.0.1.nip.io`

          db.run(
            `INSERT INTO stores 
             (storeName, userId, engine, namespace, status, url, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              storeName,
              userId,
              selectedEngine,
              storeName,
              "PROVISIONING",
              url,
              now,
              now
            ],
            function (err) {
              if (err) {
                return res.status(500).json({ error: err.message })
              }

              metrics.totalCreated++

              queueProvision({
                storeName,
                namespace: storeName,
                url,
                engine: selectedEngine
              })

              res.json({
                storeName,
                status: "PROVISIONING",
                url
              })
            }
          )
        }
      )
    }
  )
})


// ==========================
// LIST STORES
// ==========================
router.get("/", (req, res) => {
  db.all("SELECT * FROM stores", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(rows)
  })
})


// ==========================
// DELETE STORE
// ==========================
router.delete("/:storeName", async (req, res) => {
  const { storeName } = req.params

  db.get(
    "SELECT * FROM stores WHERE storeName = ?",
    [storeName],
    async (err, store) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      if (!store) {
        return res.status(404).json({ error: "Store not found" }) 
      }

      try {
        await execCommand(`helm uninstall ${storeName} -n ${storeName}`)
      } catch (e) {
        console.log("Helm uninstall error:", e.toISOString)
      }

      try {
        await execCommand(`kubectl delete namespace ${storeName}`)
      } catch (e) {
        console.log("Namespace delete error:", e.message)
      }

      db.run(
        "DELETE FROM stores WHERE storeName = ?",
        [storeName],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message })
          }

          metrics.totalDeleted++

          logActivity({
            storeName,
            action: "DELETE",
            status: "SUCCESS"
          })

          res.json({ message: "Store deleted successfully" })
        }
      )
    }
  )
})

// ==========================
// UPGRADE STORE
// ==========================
router.post("/:storeName/upgrade", async (req, res) => {
  const { storeName } = req.params

  db.get(
    "SELECT * FROM stores WHERE storeName = ?",
    [storeName],
    async (err, store) => {
      if (!store) {
        return res.status(404).json({ error: "Store not found" })
      }

      try {
        const path = require("path")
        const rootDir = path.resolve(__dirname, "../../")

        let chartPath = ""

        if (store.engine === "medusa") {
          chartPath = path.join(rootDir, "helm/medusa")
        } else {
          chartPath = path.join(rootDir, "helm/woocommerce")
        }

        await execCommand(
          `helm upgrade ${storeName} ${chartPath} -n ${storeName} --set host=${storeName}.127.0.0.1.nip.io`
        )

        logActivity({
          storeName,
          action: "UPGRADE",
          status: "SUCCESS"
        })

        return res.json({
          message: "Store upgraded successfully"
        })

      } catch (e) {
        console.error("Upgrade error:", e)

        return res.status(500).json({
          error: e.toString()
        })
      }
    }
  )
})

 // ==========================
// ROLLBACK STORE
// ==========================
router.post("/:storeName/rollback", async (req, res) => {
  const { storeName } = req.params

  db.get(
    "SELECT * FROM stores WHERE storeName = ?",
    [storeName],
    async (err, store) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      if (!store) {
        return res.status(404).json({ error: "Store not found" })
      }

      try {
        await execCommand(
          `helm rollback ${storeName} 1 -n ${storeName}`
        )

        logActivity({
          storeName,
          action: "ROLLBACK",
          status: "SUCCESS"
        })

        res.json({ message: "Rollback successful" })
      } catch (e) {
        logActivity({
          storeName,
          action: "ROLLBACK",
          status: "FAILED"
        })

        res.status(500).json({ error: "Rollback failed" })
      }
    }
  )
})


// ==========================
// METRICS
// ==========================
router.get("/metrics", (req, res) => {
  db.get("SELECT COUNT(*) as count FROM stores", [], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(getMetrics(result.count))
  })
})


// ==========================
// ACTIVITY LOG
// ==========================
router.get("/activity", (req, res) => {
  db.all(
    "SELECT * FROM activity_logs ORDER BY timestamp DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json(rows)
    }
  )
})

// ==========================
// RETRY FAILED STORE
// ==========================
router.post("/:storeName/retry", (req, res) => {
  const { storeName } = req.params

  db.get(
    "SELECT * FROM stores WHERE storeName = ?",
    [storeName],
    (err, store) => {
      if (err) {
        return res.status(500).json({ error: err.message || "Internal server error" })
      }

      if (!store) {
        return res.status(404).json({ error: "Store not found" })
      }

      if (store.status !== "FAILED") {
        return res.status(400).json({
          error: "Only FAILED stores can be retried"
        })
      }

      db.run(
        "UPDATE stores SET status=?, errorMessage=?, updatedAt=? WHERE storeName=?",
        ["PROVISIONING", null, new Date().toISOString(), storeName],
        function () {
          queueProvision({
            storeName: store.storeName,
            namespace: store.namespace,
            engine: store.engine,
            url: store.url
          })

          res.json({ message: "Retry started" })
        }
      )
    }
  )
})

module.exports = router

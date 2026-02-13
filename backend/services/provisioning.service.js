// const PQueue = require("p-queue").default
// // const PQueue = require("p-queue")
// const execCommand = require("../utils/exec.util")
// const { metrics } = require("./metrics.service")
// const { logActivity } = require("./audit.service")

// const queue = new PQueue({ concurrency: 2 })

// async function provisionStore(store) {
//   const start = Date.now()

//   try {
//     await execCommand(`kubectl create namespace ${store.storeName}`)
//     await execCommand(
//       `helm install ${store.storeName} ../helm/woocommerce -n ${store.storeName} --set host=${store.storeName}.local`
//     )

//     store.status = "READY"
//     store.durationMs = Date.now() - start
//     metrics.totalProvisionTime += store.durationMs

//     logActivity({
//       storeName: store.storeName,
//       action: "CREATE",
//       status: "SUCCESS",
//       durationMs: store.durationMs
//     })

//   } catch (err) {
//     store.status = "FAILED"
//     store.errorMessage = err.toString().slice(0, 500)
//     store.durationMs = Date.now() - start

//     metrics.totalFailed++

//     logActivity({
//       storeName: store.storeName,
//       action: "FAILED",
//       status: "ERROR",
//       durationMs: store.durationMs
//     })
//   }
// }

// function queueProvision(store) {
//   queue.add(() => provisionStore(store))
// }

// module.exports = {
//   queueProvision
// }

// ....................................AbortController.........AbortController.apply.apply.apply.apply.apply.apply....
// const PQueue = require("p-queue").default
// const execCommand = require("../utils/exec.util")
// const { metrics } = require("./metrics.service")
// const { logActivity } = require("./audit.service")
// const db = require("../db/database")
// const path = require("path");

// const path = require("path")

// let chartPath = ""

// if (store.engine === "woocommerce") {
//   chartPath = path.join(__dirname, "../../../helm/woocommerce")
// } else if (store.engine === "medusa") {
//   chartPath = path.join(__dirname, "../../../helm/medusa")
// } else {
//   throw new Error("Unsupported engine")
// }

// await execCommand(
//   `helm install ${store.storeName} ${chartPath} -n ${store.storeName} --set host=${store.storeName}.127.0.0.1.nip.io`
// );

//     // await execCommand(
//     //   `helm install ${store.storeName} ../helm/woocommerce -n ${store.storeName} --set host=${store.storeName}.127.0.0.1.nip.io`
//     // )
// // changed --set host=${store.storeName}.127.0.0.1.nip.io from --set host=${store.storeName}.local
//     const duration = Date.now() - start
//     metrics.totalProvisionTime += duration

//     // ✅ UPDATE DATABASE STATUS
//     db.run(
//       `UPDATE stores SET status=?, durationMs=?, updatedAt=? WHERE storeName=?`,
//       ["READY", duration, new Date().toISOString(), store.storeName]
//     )

//     logActivity({
//       storeName: store.storeName,
//       action: "CREATE",
//       status: "SUCCESS",
//       durationMs: duration
//     })

//     catch (err) {
//     const duration = Date.now() - start
//     metrics.totalFailed++

//     // ✅ UPDATE DATABASE FAILURE
//     db.run(
//       `UPDATE stores SET status=?, errorMessage=?, durationMs=?, updatedAt=? WHERE storeName=?`,
//       ["FAILED", err.toString().slice(0, 500), duration, new Date().toISOString(), store.storeName]
//     )

//     logActivity({
//       storeName: store.storeName,
//       action: "CREATE",
//       status: "FAILED",
//       durationMs: duration
//     })
//   }


// function queueProvision(store) {
//   queue.add(() => provisionStore(store))
// }

// module.exports = {
//   queueProvision
// }




const PQueue = require("p-queue").default
const execCommand = require("../utils/exec.util")
const { metrics } = require("./metrics.service")
const { logActivity } = require("./audit.service")
const db = require("../db/database")
const path = require("path")

// const queue = new PQueue({ concurrency: 2 })
const queue = new PQueue({
  concurrency: parseInt(process.env.PROVISION_CONCURRENCY || "2")
})

// Resolve project root safely
const rootDir = path.resolve(__dirname, "../../")

async function provisionStore(store) {
  const start = Date.now()

  try {
    let chartPath = ""

    // if (store.engine === "woocommerce") {
    //   chartPath = path.join(rootDir, "helm/woocommerce")
    // } else if (store.engine === "medusa") {
    //   chartPath = path.join(rootDir, "helm/medusa")
    if (store.engine === "woocommerce") {
      chartPath = path.join(rootDir, "helm", "woocommerce")
    } else if (store.engine === "medusa") {
      chartPath = path.join(rootDir, "helm", "medusa")
        } else {
          throw new Error("Unsupported engine")
        }

    // Create namespace
    await execCommand(`kubectl create namespace ${store.storeName}`)

    // Install Helm chart
    await execCommand(
      `helm install ${store.storeName} ${chartPath} -n ${store.storeName} --set host=${store.storeName}.127.0.0.1.nip.io`,
      { timeout: 60000 }

    )

    const duration = Date.now() - start
    metrics.totalProvisionTime += duration

    db.run(
      `UPDATE stores SET status=?, durationMs=?, updatedAt=? WHERE storeName=?`,
      ["READY", duration, new Date().toISOString(), store.storeName]
    )

    logActivity({
      storeName: store.storeName,
      action: "CREATE",
      status: "SUCCESS",
      durationMs: duration
    })

  } catch (err) {
    const duration = Date.now() - start
    metrics.totalFailed++

    db.run(
      `UPDATE stores SET status=?, errorMessage=?, durationMs=?, updatedAt=? WHERE storeName=?`,
      ["FAILED", err.toString().slice(0, 500), duration, new Date().toISOString(), store.storeName]
    )

    logActivity({
      storeName: store.storeName,
      action: "CREATE",
      status: "FAILED",
      durationMs: duration
    })
  }
}

function queueProvision(store) {
  queue.add(() => provisionStore(store))
}

module.exports = {
  queueProvision
}

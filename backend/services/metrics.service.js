let metrics = {
  totalCreated: 0,
  totalFailed: 0,
  totalDeleted: 0,
  totalProvisionTime: 0
}

function getMetrics(activeStores) {
  return {
    totalCreated: metrics.totalCreated,
    totalFailed: metrics.totalFailed,
    totalDeleted: metrics.totalDeleted,
    activeStores,
    avgProvisionTimeMs:
      metrics.totalCreated > 0
        ? Math.round(metrics.totalProvisionTime / metrics.totalCreated)
        : 0
  }
}

module.exports = {
  metrics,
  getMetrics
}

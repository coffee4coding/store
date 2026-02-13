// import React, { useEffect, useState } from "react";

// function MetricsPanel() {
//   const [metrics, setMetrics] = useState(null);
//   const API = "http://localhost:5000";

//   const fetchMetrics = async () => {
//     const res = await fetch(`${API}/stores/metrics`);
//     const data = await res.json();
//     setMetrics(data);
//   };

//   useEffect(() => {
//     fetchMetrics();
//     const interval = setInterval(fetchMetrics, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   if (!metrics) return null;

//   return (
//     <div style={{ marginBottom: "20px" }}>
//       <h3>Platform Metrics</h3>
//       <div>Total Created: {metrics.totalCreated}</div>
//       <div>Total Deleted: {metrics.totalDeleted}</div>
//       <div>Total Failed: {metrics.totalFailed}</div>
//       <div>Active Stores: {metrics.activeStores}</div>
//     </div>
//   );
// }

// export default MetricsPanel;




import React, { useEffect, useState } from "react";
import "../App.css";

function MetricsPanel() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  const API = "http://localhost:5000";

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${API}/stores/metrics`);
      if (!res.ok) throw new Error("Failed to fetch metrics");
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      setError("Unable to load metrics");
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="error-box">{error}</div>;
  }

  if (!metrics) {
    return <div className="loading-text">Loading metrics...</div>;
  }

  return (
    <div className="metrics-card">
      <h2 className="section-title">📊 Platform Metrics</h2>

      <div className="metrics-grid">
        <div className="metric-box created">
          <div className="metric-value">{metrics.totalCreated}</div>
          <div className="metric-label">Total Created</div>
        </div>

        <div className="metric-box deleted">
          <div className="metric-value">{metrics.totalDeleted}</div>
          <div className="metric-label">Total Deleted</div>
        </div>

        <div className="metric-box failed">
          <div className="metric-value">{metrics.totalFailed}</div>
          <div className="metric-label">Total Failed</div>
        </div>

        <div className="metric-box active">
          <div className="metric-value">{metrics.activeStores}</div>
          <div className="metric-label">Active Stores</div>
        </div>
      </div>
    </div>
  );
}

export default MetricsPanel;




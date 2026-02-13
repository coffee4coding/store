// import React, { useEffect, useState } from "react";

// function ActivityPanel() {
//   const [logs, setLogs] = useState([]);
//   const API = "http://localhost:5000";

//   const fetchLogs = async () => {
//     const res = await fetch(`${API}/stores/activity`);
//     const data = await res.json();
//     setLogs(data);
//   };

//   useEffect(() => {
//     fetchLogs();
//     const interval = setInterval(fetchLogs, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div style={{ marginTop: "30px" }}>
//       <h3>Activity Log</h3>
//       <ul>
//         {logs.slice().reverse().map((log, index) => (
//           <li key={index}>
//             [{new Date(log.timestamp).toLocaleTimeString()}]{" "}
//             {log.action} - {log.storeName} ({log.status})
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ActivityPanel;


import React, { useEffect, useState } from "react";
import "../App.css";

function ActivityPanel() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  const API = "http://localhost:5000";

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API}/stores/activity`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError("Unable to load activity logs");
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="activity-card">
      <h2 className="section-title">📜 Activity Log</h2>

      {error && <div className="error-box">{error}</div>}

      {logs.length === 0 ? (
        <p className="empty-text">No activity yet...</p>
      ) : (
        <div className="activity-list">
          {logs
            .slice()
            .reverse()
            .map((log, index) => (
              <div key={index} className="activity-item">
                <div className="activity-time">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>

                <div className="activity-content">
                  <strong>{log.action}</strong> — {log.storeName}
                </div>

                <div
                  className={`status-badge ${
                    log.status === "SUCCESS"
                      ? "success"
                      : log.status === "FAILED"
                      ? "failed"
                      : "info"
                  }`}
                >
                  {log.status}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default ActivityPanel;


// import React from "react";

// function StatusBadge({ status }) {
//   let background = "#f0ad4e";

//   if (status === "READY") background = "#5cb85c";
//   if (status === "FAILED") background = "#d9534f";
//   if (status === "PROVISIONING") background = "#f0ad4e";

//   return (
//     <span
//       style={{
//         background,
//         color: "white",
//         padding: "5px 10px",
//         borderRadius: "12px",
//         fontSize: "12px",
//       }}
//     >
//       {status}
//     </span>
//   );
// }

// function StoreTable({ stores, onDelete }) {
//   return (
//     <table border="1" cellPadding="10" width="100%">
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>Status</th>
//           <th>URL</th>
//           <th>Created</th>
//           <th>Duration (ms)</th>
//           <th>Error</th>
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {stores.map((store) => (
//           <tr key={store.id}>
//             <td>{store.storeName}</td>

//             <td>
//               <StatusBadge status={store.status} />
//             </td>

//             <td>
//               {store.status === "READY" && store.url && (
//                 <a href={store.url} target="_blank" rel="noreferrer">
//                   Open
//                 </a>
//               )}
//             </td>

//             <td>{new Date(store.createdAt).toLocaleString()}</td>

//             <td>{store.durationMs || "-"}</td>

//             <td style={{ color: "red", maxWidth: "200px" }}>
//               {store.errorMessage
//                 ? store.errorMessage.slice(0, 100)
//                 : "-"}
//             </td>

//             <td>
//               <button onClick={() => onDelete(store.storeName)}>
//                 Delete
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// export default StoreTable;


import React from "react";
import "../App.css";

function StatusBadge({ status }) {
  let className = "status-badge provisioning";

  if (status === "READY") className = "status-badge ready";
  if (status === "FAILED") className = "status-badge failed";
  if (status === "PROVISIONING") className = "status-badge provisioning";

  return <span className={className}>{status}</span>;
}

function StoreTable({ stores, onDelete }) {
  if (!stores || stores.length === 0) {
    return (
      <div className="empty-state">
        No stores yet. Create your first store 🚀
      </div>
    );
  }

  return (
    <div className="table-card">
      <h2 className="section-title">🛍 Stores</h2>

      <div className="table-wrapper">
        <table className="store-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>URL</th>
              <th>Created</th>
              <th>Duration</th>
              <th>Error</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="store-name">{store.storeName}</td>

                <td>
                  <StatusBadge status={store.status} />
                </td>

                <td>
                  {store.status === "READY" && store.url ? (
                    <a
                      href={store.url}
                      target="_blank"
                      rel="noreferrer"
                      className="open-link"
                    >
                      Open
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  {store.createdAt
                    ? new Date(store.createdAt).toLocaleString()
                    : "-"}
                </td>

                <td>{store.durationMs || "-"}</td>

                <td className="error-cell">
                  {store.errorMessage
                    ? store.errorMessage.slice(0, 80)
                    : "-"}
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(store.storeName)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StoreTable;

import React, { useEffect, useState } from "react";
import "./App.css";
import StoreForm from "./components/StoreForm";
import StoreTable from "./components/StoreTable";
import MetricsPanel from "./components/MetricsPanel";
import ActivityPanel from "./components/ActivityPanel";

function App() {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);

  const API = "http://localhost:5000";

  // ==========================
  // FETCH STORES
  // ==========================
  const fetchStores = async () => {
    try {
      const res = await fetch(`${API}/stores`);
      if (!res.ok) throw new Error("Failed to fetch stores");
      const data = await res.json();
      setStores(data);
    } catch (err) {
      console.error(err);
      setError("Backend not reachable");
    }
  };

  // ==========================
  // AUTO REFRESH
  // ==========================
  useEffect(() => {
    fetchStores();
    const interval = setInterval(fetchStores, 5000);
    return () => clearInterval(interval);
  }, []);

  // ==========================
  // CREATE STORE
  // ==========================
  const createStore = async (storeName, engine) => {
    try {
      setError(null);

      const res = await fetch(`${API}/stores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          userId: "rahul",
          engine
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Store creation failed");
      }

      fetchStores();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // ==========================
  // DELETE STORE
  // ==========================
  const deleteStore = async (name) => {
    try {
      await fetch(`${API}/stores/${name}`, {
        method: "DELETE",
      });
      fetchStores();
    } catch (err) {
      console.error(err);
      setError("Failed to delete store");
    }
  };

  return (
    <div className="app-container">
      <div className="dashboard-card">
        <h1 className="title">🚀 Store Provisioning Platform</h1>

        <MetricsPanel />

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <StoreForm onCreate={createStore} />
        <StoreTable stores={stores} onDelete={deleteStore} />
        <ActivityPanel />
      </div>
    </div>
  );
}

export default App;

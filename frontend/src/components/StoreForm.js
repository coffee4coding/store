

import React, { useState } from "react";

function StoreForm({ onCreate }) {
  const [storeName, setStoreName] = useState("");
  const [engine, setEngine] = useState("woocommerce");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!storeName) return;
    setLoading(true);
    await onCreate(storeName, engine);
    setStoreName("");
    setLoading(false);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Store name"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />

      <select
        value={engine}
        onChange={(e) => setEngine(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      >
        <option value="woocommerce">WooCommerce</option>
        <option value="medusa">Medusa</option>
      </select>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create Store"}
      </button>
    </div>
  );
}

export default StoreForm;

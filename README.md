<h1>🏪 Store Provisioning Platform</h1>

<p>
A lightweight store provisioning and ordering system designed for scalable deployment
(local development + k3s production).
</p>

<hr/>

<h2>📦 Features</h2>

<ul>
  <li>Create and manage stores</li>
  <li>Place and track orders</li>
  <li>REST API based workflow</li>
  <li>Containerized deployment</li>
  <li>k3s compatible production setup</li>
</ul>

<hr/>

<h1>🚀 Local Setup Instructions</h1>

<h3>1️⃣ Clone the Repository</h3>

<pre>
<ul>
  <li><code>cd ~</code></li>
  <li>git clone https://github.com/coffee4coding/store.git </li>
   <li><code>cd store-platform</code></li>
  <li><code>chmod +x setup.sh</code></li>
  <li><code>./setup.sh</code></li>
</ul>

</pre>

<h2>If not working go for step by step setup(Review New_Laptop_Setup.md file) </h2>


<h3>2️⃣ Setup Environment Variables</h3>

<pre><code>DATABASE_URL=your_database_url
JWT_SECRET=your_secret
</code></pre>

<h3>3️⃣ Install Dependencies</h3>

<pre><code>npm install
</code></pre>

<h3>4️⃣ Run Database (if using Docker)</h3>

<pre><code>docker compose up -d
</code></pre>

<h3>5️⃣ Start the Application</h3>

<pre><code>npm run dev
</code></pre>

<p><strong>OR</strong></p>

<pre><code>npm start
</code></pre>

<h3>6️⃣ Access Application</h3>

<p><strong>http://localhost:5000</strong></p>

<hr/>

<h2>🖥️ VPS / Production Setup (k3s Deployment)</h2>

<h3>1️⃣ Provision a VPS</h3>

<p><strong>Minimum recommended:</strong></p>

<ul>
  <li>2 vCPU</li>
  <li>4GB RAM</li>
  <li>Ubuntu 22.04</li>
</ul>

<h3>2️⃣ Install k3s</h3>

<pre><code>curl -sfL https://get.k3s.io | sh -
</code></pre>

<p><strong>Check status:</strong></p>

<pre><code>sudo k3s kubectl get nodes
</code></pre>

<h3>3️⃣ Build Docker Image</h3>

<p>On your local machine:</p>

<pre><code>docker build -t your-dockerhub-username/store-app:latest .
docker push your-dockerhub-username/store-app:latest
</code></pre>

<h3>4️⃣ Create Kubernetes Deployment</h3>

<pre><code>sudo k3s kubectl apply -f deployment.yaml
</code></pre>

<h3>5️⃣ Create Service</h3>

<p>Create <strong>service.yaml</strong> and apply it:</p>

<pre><code>sudo k3s kubectl apply -f service.yaml
</code></pre>

<hr/>

<h2>🏬 How to Create a Store</h2>

<h3>📌 API Endpoint</h3>
<pre><code>POST /api/stores
</code></pre>

<h3>📥 Request Body</h3>

<pre><code>{
  "name": "My Store",
  "owner": "Rahul",
  "email": "owner@email.com"
}
</code></pre>

<h3>📤 Example cURL</h3>

<pre><code>curl -X POST http://localhost:5000/api/stores \
-H "Content-Type: application/json" \
-d '{"name":"My Store","owner":"Rahul","email":"owner@email.com"}'
</code></pre>

<h3>✅ Response</h3>

<pre><code>{
  "id": "store_id",
  "name": "My Store",
  "status": "created"
}
</code></pre>

<hr/>

<h2>🛒 How to Place an Order</h2>

<h3>📌 API Endpoint</h3>

<pre><code>POST /api/orders
</code></pre>

<hr/>

<h2>🧪 Running Tests</h2>

<pre><code>npm test
</code></pre>

<hr/>

<h2>📁 Project Structure</h2>

<pre><code>.
├── src/
├── controllers/
├── models/
├── routes/
├── deployment.yaml
├── service.yaml
├── Dockerfile
├── docker-compose.yml
└── README.md
</code></pre>

<hr/>

<h2>🔐 Environment Variables Reference</h2>

<table>
<tr><th>Variable</th><th>Description</th></tr>
<tr><td>PORT</td><td>Application Port</td></tr>
<tr><td>DATABASE_URL</td><td>Database Connection String</td></tr>
<tr><td>JWT_SECRET</td><td>Secret for Authentication</td></tr>
</table>

<hr/>

<h2>📌 Production Notes</h2>

<ul>
  <li>Use Ingress for domain routing in production</li>
  <li>Use Persistent Volumes for database storage</li>
  <li>Use Secrets instead of plain env variables</li>
  <li>Configure TLS with cert-manager</li>
</ul>

<hr/>

<h2>👨‍💻 Author</h2>

<p><strong>Rahul Kumar</strong></p>

<hr/>

<h2>📂 Project Structure (Implementation Map)</h2>

<pre><code>backend/
  server.js
  db/database.js
  routes/stores.routes.js
  services/
    provisioning.service.js
    metrics.service.js
    audit.service.js
  utils/exec.util.js

frontend/
  src/
    App.js
    components/
      StoreForm.js
      StoreTable.js
      MetricsPanel.js
      ActivityPanel.js

helm/
  woocommerce/
  medusa/
</code></pre>

<hr/>

<h2>⚙️ Failure Handling & Idempotency</h2>

<p>The system enforces:</p>

<ul>
  <li>Unique storeName</li>
  <li>Max 3 stores per user</li>
  <li>Retry only from FAILED state</li>
  <li>Status updated to FAILED on shell error</li>
  <li>Audit logs recorded for every action</li>
</ul>

<h3>Delete Semantics</h3>

<ul>
  <li>Attempt Helm uninstall</li>
  <li>Attempt namespace delete</li>
  <li>Remove DB entry even if partial failures occur</li>
</ul>

<p>This prevents orphaned metadata.</p>

<hr/>

<h2>📊 Observability & Auditability</h2>

<h3>The Control Plane Exposes</h3>

<pre><code>/stores/metrics
/stores/activity
</code></pre>

<h3>Metrics Include</h3>

<ul>
  <li>Active stores</li>
  <li>Provisioning count</li>
  <li>Failure count</li>
  <li>Upgrade count</li>
  <li>Rollback count</li>
  <li>Retry count</li>
</ul>

<h3>Activity Logs Persist</h3>

<ul>
  <li>Action type</li>
  <li>Store name</li>
  <li>Timestamp</li>
</ul>

<p>This introduces:</p>

<ul>
  <li>Operational visibility</li>
  <li>Basic auditability</li>
  <li>Measurable system behavior</li>
</ul>

<hr/>

<h1>🚨 Edge Cases Explicitly Handled</h1>

<ul>
  <li>Missing storeName / userId → 400</li>
  <li>Duplicate storeName → 400</li>
  <li>Max store limit exceeded → 403</li>
  <li>Non-existent store → 404</li>
  <li>Retry on non-FAILED store → 400</li>
  <li>DB errors → 500</li>
  <li>Shell command failures → status FAILED + log entry</li>
  <li>Frontend handles empty and error states</li>
</ul>

<hr/>

<h2>⚡ Setup Instructions (Condensed but Complete)</h2>

<h3>Backend</h3>

<pre><code>cd backend
npm install
node server.js
</code></pre>

<h3>Frontend</h3>

<pre><code>cd frontend
npm install
npm start
</code></pre>

<h3>Cluster Must Have</h3>

<ul>
  <li>kubectl</li>
  <li>helm</li>
</ul>

<hr/>

<h1>🏁 Conclusion</h1>

<p>
This project is not merely a CRUD API with a dashboard.
</p>

<p>
It is a compact but architecturally intentional control plane that:
</p>

<ul>
  <li>Orchestrates Kubernetes workloads</li>
  <li>Persists lifecycle state</li>
  <li>Enforces operational guardrails</li>
  <li>Handles failure deterministically</li>
  <li>Exposes metrics and auditability</li>
  <li>Separates orchestration from execution</li>
</ul>

<p>
The design balances simplicity and realism while preserving a clear path
toward production-grade evolution.
</p>

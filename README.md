<h1>🏪 Store Provisioning Platform</h1>

A lightweight store provisioning and ordering system designed for scalable deployment (local + k3s production).

📦 Features

Create and manage stores

Place and track orders

REST API based workflow

Containerized deployment

k3s compatible production setup

<h1>🚀 Local Setup Instructions</h1>

<h3>1️⃣ Clone the Repository</h3>
git clone https://github.com/your-username/your-repo.git
cd your-repo

<h3>2️⃣ Setup Environment Variables</h3>

DATABASE_URL=your_database_url
JWT_SECRET=your_secret

<h3>3️⃣ Install Dependencies</h3>
npm install

<h3>4️⃣ Run Database (if using Docker)</h3>
docker compose up -d

<h3>5️⃣ Start the Application</h3>
npm run dev


OR

npm start

<h3>6️⃣ Access Application</h3>
http://localhost:5000


<h2>🖥️ VPS / Production Setup (k3s Deployment)</h2>
1️⃣ Provision a VPS

Minimum recommended:

2 vCPU

4GB RAM

Ubuntu 22.04

2️⃣ Install k3s
curl -sfL https://get.k3s.io | sh -


Check status:

sudo k3s kubectl get nodes

3️⃣ Build Docker Image

On your local machine:

docker build -t your-dockerhub-username/store-app:latest .
docker push your-dockerhub-username/store-app:latest

4️⃣ Create Kubernetes Deployment

sudo k3s kubectl apply -f deployment.yaml

5️⃣ Create Service

Create service.yaml:


🏬 How to Create a Store
📌 API Endpoint
POST /api/stores

📥 Request Body
{
  "name": "My Store",
  "owner": "Rahul",
  "email": "owner@email.com"
}

📤 Example cURL
curl -X POST http://localhost:5000/api/stores \
-H "Content-Type: application/json" \
-d '{"name":"My Store","owner":"Rahul","email":"owner@email.com"}'

✅ Response
{
  "id": "store_id",
  "name": "My Store",
  "status": "created"
}

🛒 How to Place an Order
📌 API Endpoint
POST /api/orders


🧪 Running Tests
npm test

📁 Project Structure
.
├── src/
├── controllers/
├── models/
├── routes/
├── deployment.yaml
├── service.yaml
├── Dockerfile
├── docker-compose.yml
└── README.md

🔐 Environment Variables Reference
Variable	Description
PORT	Application Port
DATABASE_URL	Database Connection String
JWT_SECRET	Secret for Authentication
📌 Production Notes

Use Ingress for domain routing in production

Use Persistent Volumes for database storage

Use Secrets instead of plain env variables

Configure TLS with cert-manager

👨‍💻 Author

Rahul Kumar



<h3>Project Structure (Implementation Map)</h3>
backend/
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



<h4>Failure Handling & Idempotency</h4>

The system enforces:

Unique storeName

Max 3 stores per user

Retry only from FAILED state

Status updated to FAILED on shell error

Audit logs recorded for every action

<h4>Delete semantics:</h4>

Attempt Helm uninstall

Attempt namespace delete

Remove DB entry even if partial failures occur

This prevents orphaned metadata.

Observability & Auditability

<h4>The control plane exposes:</h4>

/stores/metrics

/stores/activity

<h4>Metrics include:</h4>

Active stores

Provisioning count

Failure count

Upgrade count

Rollback count

Retry count

<h4>Activity logs persist:</h4>

Action type

Store name

Timestamp

This introduces:

Operational visibility

Basic auditability

Measurable system behavior



<h1>Edge Cases Explicitly Handled</h1>

Missing storeName / userId → 400

Duplicate storeName → 400

Max store limit exceeded → 403

Non-existent store → 404

Retry on non-FAILED store → 400

DB errors → 500

Shell command failures → status FAILED + log entry

Frontend handles empty and error states


<h2>Setup Instructions (Condensed but Complete)</h2>

<h4>Backend:</h4>

cd backend
npm install
node server.js


<h4>Frontend:</h4>

cd frontend
npm install
npm start


<h4>Cluster must have:</h4>

kubectl

helm


<h1>Conclusion</h1>

This project is not merely a CRUD API with a dashboard.

It is a compact but architecturally intentional control plane that:

Orchestrates Kubernetes workloads

Persists lifecycle state

Enforces operational guardrails

Handles failure deterministically

Exposes metrics and auditability

Separates orchestration from execution

The design balances simplicity and realism while preserving a clear path toward production-grade evolution.

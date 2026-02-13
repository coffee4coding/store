Store Provisioning Platform
Kubernetes-Native Control Plane for Store Lifecycle Management
1. Executive Summary

This project implements a compact but realistic store provisioning control plane that orchestrates the lifecycle of e-commerce store instances on Kubernetes.

The system consists of:

A Node.js control plane API

A React dashboard

A SQLite metadata store

A Helm-based orchestration layer

The backend does not run store workloads itself.
Instead, it acts as a control plane, translating user intent into Kubernetes state through helm and kubectl.

The actual store workloads (WooCommerce / Medusa) run inside Kubernetes and form the data plane.

This separation mirrors real-world SaaS infrastructure design.



2. Architectural Model

Control Plane vs Data Plane
Control Plane (This Repository)

Responsibilities:

Accept store lifecycle requests (create/delete/upgrade/rollback/retry)

Persist store metadata and audit logs

Enforce guardrails (max stores, uniqueness)

Queue and throttle provisioning

Execute Helm operations

Track lifecycle state transitions

Expose metrics and activity APIs

Technology:

Node.js + Express

SQLite

p-queue

child_process

Data Plane (Kubernetes + Helm Charts)

Responsibilities:

Run actual store workloads

Manage pods, services, ingress

Handle persistent volumes

Provide store endpoints

Enforce resource boundaries

Technology:

Kubernetes cluster (k3s/k3d)

Helm charts (helm/woocommerce, helm/medusa)

Ingress controller

The control plane does not embed Kubernetes logic directly.
It delegates deployment logic to Helm charts, keeping the application code infrastructure-agnostic.



3. System Architecture Diagram

Browser (React Dashboard)
          │
          ▼
Node.js Control Plane (Express API)
          │
          ▼
Provisioning Queue (p-queue)
          │
          ▼
Helm CLI → Kubernetes API
          │
          ▼
Namespace-per-Store Deployment
          │
          ▼
WordPress / Medusa Store Instance



4. Store Lifecycle Model

The system enforces an explicit lifecycle state machine:

NEW → PROVISIONING → READY
                 ↘
                  FAILED → RETRY → PROVISIONING

State Semantics

PROVISIONING
Helm install/upgrade/rollback is in progress.

READY
Helm command completed successfully and store endpoint is available.

FAILED
Helm or kubectl command failed. Error stored in DB.

Retry is only allowed from FAILED state.

This explicit lifecycle tracking ensures:

Deterministic behavior

Recoverable failures

Auditability

Clear UI semantics



5. Design Decisions & Engineering Rationale
5.1 SQLite as Embedded Metadata Store

Why SQLite?

Zero external dependency

Portable single-file DB

Automatic schema initialization

Deterministic local setup

Ideal for single-node control plane

Trade-off:

Not horizontally scalable

Would be replaced with Postgres in production

5.2 Command-Based Orchestration (kubectl + helm)

Instead of:

Direct Kubernetes API integration

Writing a custom operator

We use shell-based orchestration via:

helm install

helm upgrade

helm rollback

kubectl delete namespace

Why?

Simplicity

Clear abstraction boundary

Avoid reimplementing Helm logic

Faster development cycle

Trade-off:

Shell execution adds operational risk

Harder to test

No fine-grained API interaction

5.3 Concurrency Control with p-queue

Provisioning operations are queued using:

p-queue


Controlled by:

PROVISION_CONCURRENCY (default: 2)


Why is this necessary?

Without throttling:

Multiple concurrent Helm installs may overload the cluster

Namespace creation may race

CPU spikes may occur

DB state may become inconsistent

The queue ensures:

Controlled parallelism

Backpressure handling

Stable cluster behavior

Predictable system performance

This introduces reliability engineering principles into a small system.

5.4 Namespace-per-Store Isolation

Each store is deployed into its own Kubernetes namespace.

Benefits:

Logical isolation

Clean deletion

Reduced blast radius

Independent upgrades

Easier observability

Resource boundary enforcement (via charts)

This mirrors multi-tenant SaaS best practices.

5.5 Polling Instead of Push (Frontend)

The frontend polls:

/stores

/stores/metrics

/stores/activity

Every 5 seconds.

Why polling?

Simpler implementation

No need for WebSockets

Adequate for low-frequency state changes

Reduces architectural complexity

Trade-off:

Slightly less efficient than event-driven updates



6. Tech Stack
Backend

Node.js (LTS)

Express

SQLite (sqlite3)

p-queue

child_process

Frontend

React (Create React App)

Fetch API

Functional components + Hooks

Polling with setInterval

Infrastructure

Kubernetes (k3s / k3d)

Helm

kubectl



7. Project Structure (Implementation Map)
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


Helm charts are referenced but not included.



8. Failure Handling & Idempotency

The system enforces:

Unique storeName

Max 3 stores per user

Retry only from FAILED state

Status updated to FAILED on shell error

Audit logs recorded for every action

Delete semantics:

Attempt Helm uninstall

Attempt namespace delete

Remove DB entry even if partial failures occur

This prevents orphaned metadata.



9. Observability & Auditability

The control plane exposes:

/stores/metrics

/stores/activity

Metrics include:

Active stores

Provisioning count

Failure count

Upgrade count

Rollback count

Retry count

Activity logs persist:

Action type

Store name

Timestamp

This introduces:

Operational visibility

Basic auditability

Measurable system behavior



10. Edge Cases Explicitly Handled

Missing storeName / userId → 400

Duplicate storeName → 400

Max store limit exceeded → 403

Non-existent store → 404

Retry on non-FAILED store → 400

DB errors → 500

Shell command failures → status FAILED + log entry

Frontend handles empty and error states



11. Setup Instructions (Condensed but Complete)
Local

Backend:

cd backend
npm install
node server.js


Frontend:

cd frontend
npm install
npm start


Cluster must have:

kubectl

helm

valid KUBECONFIG

Charts required in:

helm/woocommerce
helm/medusa

Production-like (k3s)

Install k3s:

curl -sfL https://get.k3s.io | sh -


Configure kubeconfig and verify:

kubectl get nodes


Deploy charts with:

helm install <release> ./helm/woocommerce


Run backend with:

PROVISION_CONCURRENCY=4 NODE_ENV=production node server.js



12. What Changes for Real Production

If evolving this into production:

Replace SQLite with Postgres

Add authentication and authorization

Run control plane inside Kubernetes

Containerize backend + frontend

Add health checks

Add structured logging

Introduce Prometheus metrics

Use real DNS + TLS

Replace shell execution with Kubernetes client or Operator

The architecture supports this evolution without redesign.



13. Key Strengths of This Implementation

Clear control/data plane separation

Explicit lifecycle modeling

Deterministic failure handling

Concurrency throttling

Audit logging

Metrics endpoint

Namespace-based isolation

Clean separation of concerns

Production evolution path identified



14. Conclusion

This project is not merely a CRUD API with a dashboard.

It is a compact but architecturally intentional control plane that:

Orchestrates Kubernetes workloads

Persists lifecycle state

Enforces operational guardrails

Handles failure deterministically

Exposes metrics and auditability

Separates orchestration from execution

The design balances simplicity and realism while preserving a clear path toward production-grade evolution.
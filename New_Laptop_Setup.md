<h1>Store Platform Infrastructure Setup Guide</h1>

<h2>1. Operating System</h2>

<h3>Recommended</h3>
<p><strong>Ubuntu 22.04 LTS</strong></p>
<ul>
  <li>Stable</li>
  <li>Kubernetes-friendly</li>
  <li>Huge ecosystem support</li>
</ul>

<h3>Alternatives</h3>
<ul>
  <li>Pop!_OS (also fine)</li>
  <li>Ubuntu 24.04 LTS (also works)</li>
</ul>

<h3>Avoid</h3>
<ul>
  <li>Windows (for this type of infra project)</li>
  <li>Mac M-series (needs extra Docker config)</li>
  <li>Arch (more debugging time)</li>
</ul>

<hr/>

<h2>2. Minimum Hardware Requirements</h2>

<table>
<tr><th>Component</th><th>Recommended</th></tr>
<tr><td>RAM</td><td>8 GB minimum (16 GB ideal)</td></tr>
<tr><td>CPU</td><td>4+ cores</td></tr>
<tr><td>Storage</td><td>30 GB free</td></tr>
</table>

<p><strong>You will be running:</strong></p>
<ul>
  <li>k3s cluster</li>
  <li>MySQL</li>
  <li>WordPress</li>
  <li>Node backend</li>
  <li>React frontend</li>
  <li>Docker containers</li>
</ul>

<hr/>

<h2>3. System Packages</h2>

<h3>Update System</h3>

<pre><code>sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential
</code></pre>

<hr/>

<h2>4. Install Node.js (IMPORTANT)</h2>

<h3>Install Node 20</h3>

<pre><code>curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
</code></pre>

<h3>Verify</h3>

<pre><code>node -v
npm -v
</code></pre>

<hr/>

<h2>5. Install Docker</h2>

<pre><code>sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
</code></pre>

<h3>Add User to Docker Group</h3>

<pre><code>sudo usermod -aG docker $USER
</code></pre>

<p>Logout and login again.</p>

<h3>Verify</h3>

<pre><code>docker ps
</code></pre>

<hr/>

<h2>6. Install k3d (Local Kubernetes)</h2>

<pre><code>curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
</code></pre>

<h3>Create Cluster</h3>

<pre><code>k3d cluster create store \
 --agents 2 \
 -p "80:80@loadbalancer"
</code></pre>

<h3>Code Install</h3>

<pre><code>sudo snap install code --classic
</code></pre>

<h3>Kuectl Install</h3>

<pre><code>sudo snap install kubectl --classic
</code></pre>

<h3>Verify</h3>

<pre><code>kubectl get nodes
</code></pre>

<hr/>

<h2>7. Install Helm</h2>

<pre><code>curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
</code></pre>

<h3>Verify</h3>

<pre><code>helm version
</code></pre>

<hr/>

<h2>8. Install Ingress</h2>

<p>Traefik comes default in k3s.</p>

<h3>Verify</h3>

<pre><code>kubectl get pods -n kube-system
</code></pre>

<p>You should see <strong>traefik</strong> running.</p>

<hr/>

<h2>9. Clone Your Project</h2>

<pre><code>git clone &lt;your-repo&gt;
cd store
</code></pre>

<h3>Project Structure</h3>

<pre><code>store/
 ├── backend/
 ├── frontend/
 └── helm/
</code></pre>

<hr/>

<h2>10. Backend Setup</h2>

<pre><code>cd backend
npm install
node server.js
</code></pre>

<p><strong>Expected Output:</strong></p>

<pre><code>Provisioning API running on port 5000
</code></pre>

Now open new terminal 

<hr/>

<h2>11. Frontend Setup</h2>

<pre><code>cd store/frontend
npm install
npm start
</code></pre>

<p>Should open:</p>
<p><strong>http://localhost:3000</strong></p>

<hr/>

<h2>12. Domain Handling (IMPORTANT)</h2>

<p>We switched to:</p>

<pre><code>store-name.127.0.0.1.nip.io
</code></pre>

<p>No need to edit <code>/etc/hosts</code>.</p>

<h3>Test</h3>

<pre><code>ping test.127.0.0.1.nip.io
</code></pre>

<hr/>

<h2>13. Test Provisioning</h2>

<h3>From UI</h3>
<ul>
  <li>Create store</li>
  <li>Wait 30–60 sec</li>
  <li>Click Open</li>
</ul>

<h3>Using curl</h3>

<pre><code>curl -X POST http://localhost:5000/stores \
-H "Content-Type: application/json" \
-d '{"storeName":"demo","userId":"rahul"}'
</code></pre>

<hr/>

<h2>14. SQLite</h2>

<p>No need to install system sqlite.</p>
<p>Backend already installs:</p>
<ul>
  <li>sqlite3 (npm package)</li>
</ul>

<h3>Database File</h3>

<pre><code>backend/controlplane.db
</code></pre>

<h3>Check</h3>

<pre><code>ls backend
</code></pre>

<hr/>

<h2>15. Required Free Ports</h2>

<table>
<tr><th>Port</th><th>Used By</th></tr>
<tr><td>3000</td><td>React</td></tr>
<tr><td>5000</td><td>Backend</td></tr>
<tr><td>80</td><td>Kubernetes ingress</td></tr>
<tr><td>6443</td><td>k3s API</td></tr>
</table>

<p>If blocked, cluster fails.</p>

<hr/>

<h2>16. Required Tech Stack Summary</h2>

<h3>Infrastructure</h3>
<ul>
  <li>Docker</li>
  <li>k3d (k3s)</li>
  <li>Helm</li>
  <li>kubectl</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Node.js 20</li>
  <li>Express</li>
  <li>SQLite</li>
  <li>p-queue</li>
  <li>Helm CLI</li>
</ul>

<h3>Frontend</h3>
<ul>
  <li>React</li>
  <li>Fetch API</li>
</ul>

<h3>Charts</h3>
<ul>
  <li>WordPress Helm chart</li>
  <li>MySQL Deployment</li>
  <li>PVC</li>
  <li>Secret</li>
  <li>Ingress</li>
</ul>

<hr/>

<h2>17. Complete Setup Command Summary</h2>

<pre><code>sudo apt update
sudo apt install -y curl git docker.io
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
k3d cluster create store --agents 2 -p "80:80@loadbalancer"
git clone &lt;repo&gt;
cd store/backend
npm install
node server.js
cd ../frontend
npm install
npm start
</code></pre>

<hr/>

<h2>18. Things That Might Break</h2>

<table>
<tr><th>Issue</th><th>Cause</th></tr>
<tr><td>ImagePullBackOff</td><td>No internet</td></tr>
<tr><td>Store not opening</td><td>Ingress not ready</td></tr>
<tr><td>DB connection error</td><td>Secret mismatch</td></tr>
<tr><td>Failed to fetch</td><td>Backend not running</td></tr>
<tr><td>Helm path not found</td><td>Wrong chartPath</td></tr>
</table>

<hr/>

<h2>19. Optional Improvements</h2>

<ul>
  <li>Use 16GB RAM</li>
  <li>Use Ubuntu Server (lighter)</li>
  <li>Enable swap</li>
  <li>Install k9s for cluster debugging</li>
</ul>

<hr/>

<h2>20. Version Compatibility (IMPORTANT)</h2>

<ul>
  <li>Node 20</li>
  <li>Helm 3+</li>
  <li>k3d latest</li>
  <li>Docker 24+</li>
</ul>

<p><strong>Do NOT mix Node 12/14.</strong></p>

<hr/>

<h2>21. Final Advice</h2>

<ol>
  <li>Install everything first</li>
  <li>Create cluster</li>
  <li>Verify cluster healthy</li>
  <li>Then run backend</li>
  <li>Then run frontend</li>
  <li>Then create store</li>
</ol>

<p><strong>Never start coding before infra works.</strong></p>

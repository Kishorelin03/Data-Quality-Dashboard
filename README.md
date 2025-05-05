

<h1>📊 Data Quality Dashboard</h1>

<p>A full-stack application built using <strong>Flask (Python)</strong> and <strong>React (JavaScript)</strong> that allows users to upload CSV datasets, visualize them, and run data quality checks such as:</p>

<ul>
  <li>Schema validation (customizable by user)</li>
  <li>Null-rate detection and filling</li>
  <li>Anomaly detection (Isolation Forest based)</li>
  <li>File preview and structure inspection</li>
  <li>Export cleaned dataset</li>
</ul>

<h2>🌟 Features</h2>
<ul>
  <li>Upload CSV files and preview data</li>
  <li>Detect and validate schema types (str, int, float, bool)</li>
  <li>Fill missing (null) values with custom inputs</li>
  <li>Visualize null rates as bar chart</li>
  <li>Identify and view anomalies in data</li>
  <li>Export cleaned datasets after filling nulls</li>
</ul>

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><strong>Frontend</strong>: React + MUI + Recharts</li>
  <li><strong>Backend</strong>: Flask + Pandas + scikit-learn</li>
  <li><strong>Data Visualization</strong>: Recharts (React)</li>
</ul>

<h2>🚀 Getting Started</h2>

<h3>1. Clone the Repository</h3>
<pre><code>git clone https://github.com/your-username/data-quality-dashboard.git
cd data-quality-dashboard
</code></pre>

<h3>2. Setup the Backend (Flask)</h3>
<pre><code>cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
</code></pre>
<p><strong>URL:</strong> <code>http://localhost:5050</code></p>

<h3>3. Setup the Frontend (React)</h3>
<pre><code>cd ../frontend
npm install
npm start
</code></pre>
<p><strong>URL:</strong> <code>http://localhost:3000</code></p>

<h2>🔧 API Endpoints</h2>
<table>
  <tr><th>Method</th><th>Endpoint</th><th>Description</th></tr>
  <tr><td>GET</td><td>/api/health</td><td>Health check</td></tr>
  <tr><td>POST</td><td>/api/upload</td><td>Upload CSV</td></tr>
  <tr><td>GET</td><td>/api/snapshot</td><td>Get first 10 rows</td></tr>
  <tr><td>GET</td><td>/api/null-rates</td><td>Get null-rate per column</td></tr>
  <tr><td>GET</td><td>/api/anomalies</td><td>Detect anomalies</td></tr>
  <tr><td>GET</td><td>/api/detect-schema</td><td>Infer schema</td></tr>
  <tr><td>POST</td><td>/api/schema-check</td><td>Validate schema</td></tr>
  <tr><td>POST</td><td>/api/fill-nulls</td><td>Fill missing values</td></tr>
  <tr><td>GET</td><td>/api/download-filled</td><td>Download cleaned CSV</td></tr>
  <tr><td>POST</td><td>/api/run-checks</td><td>Run all validations</td></tr>
</table>

<h2>🧑‍💻 How to Use</h2>
<ol>
  <li>Upload a CSV file from the UI.</li>
  <li>Click <strong>Run All Checks</strong> to validate your dataset.</li>
  <li>Optionally define schema rules and revalidate.</li>
  <li>Use the Null Filler to replace missing values.</li>
  <li>Download the cleaned file.</li>
</ol>




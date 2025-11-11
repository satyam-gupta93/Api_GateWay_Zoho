require('dotenv').config({ path: '../.env' });
const express = require('express');
const connectDB = require('../utils/db');
const RequestLog = require('../models/RequestLog');

const app = express();
const PORT = process.env.DASHBOARD_PORT || 7000;

let dbConnected = false;

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Missing MONGO_URI in .env file!');
      process.exit(1);
    }
    await connectDB();
    dbConnected = true;
    console.log('MongoDB connected successfully (Dashboard)');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
  }
})();

app.get('/', async (req, res) => {
  if (!dbConnected) {
    return res.send(`
      <h2 style="color:red; text-align:center;">⚠️ MongoDB not connected!</h2>
      <p style="text-align:center;">Check your connection string or restart the dashboard once MongoDB is online.</p>
    `);
  }

  try {
    const logs = await RequestLog.find().sort({ createdAt: -1 }).limit(15);
    const html = `
      <html>
      <head>
        <title>API Gateway Dashboard</title>
        <style>
          body { font-family: Arial; background: #f5f7fa; padding: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background: #4CAF50; color: white; }
          h2 { text-align: center; color: #333; }
        </style>
      </head>
      <body>
        <h2>API Gateway Dashboard</h2>
        <table>
          <tr>
            <th>Method</th><th>Path</th><th>Status</th>
            <th>Response Time (ms)</th><th>IP</th><th>Timestamp</th>
          </tr>
          ${logs.map(l => `
            <tr>
              <td>${l.method}</td>
              <td>${l.path}</td>
              <td>${l.status_code}</td>
              <td>${l.response_time}</td>
              <td>${l.ip_address}</td>
              <td>${new Date(l.createdAt).toLocaleString()}</td>
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    console.error('Error fetching logs:', err.message);
    res.status(500).send('<h2 style="color:red; text-align:center;">⚠️ Unable to load logs from MongoDB</h2>');
  }
});

app.listen(PORT, () => console.log(`Dashboard running at http://localhost:${PORT}`));

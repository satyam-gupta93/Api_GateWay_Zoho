
require('dotenv').config({ path: '../.env' });

const express = require('express');
const connectDB = require('../utils/db');
const RequestLog = require('../models/RequestLog');

const app = express();
const PORT = process.env.DASHBOARD_PORT || 7000;

let isDBConnected = false;

// Initialize MongoDB connection
(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Missing MONGO_URI in the .env file.');
      process.exit(1);
    }

    await connectDB();
    isDBConnected = true;
    console.log('MongoDB connection established successfully (Dashboard)');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
  }
})();

// Dashboard route
app.get('/', async (req, res) => {
  if (!isDBConnected) {
    return res.send(`
      <h2 style="color:red; text-align:center;">MongoDB Connection Error</h2>
      <p style="text-align:center;">Please verify your connection string or restart the dashboard once MongoDB is active.</p>
    `);
  }

  try {
    const recentLogs = await RequestLog.find()
      .sort({ createdAt: -1 })
      .limit(15);

    const htmlResponse = `
      <html>
        <head>
          <title>API Gateway Dashboard</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background-color: #f0f3f8;
              padding: 25px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-top: 20px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: center;
            }
            th {
              background-color: #4CAF50;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            h2 {
              text-align: center;
              color: #333;
            }
          </style>
        </head>
        <body>
          <h2>API Gateway - Dashboard Logs</h2>
          <table>
            <tr>
              <th>HTTP Method</th>
              <th>Endpoint</th>
              <th>Status Code</th>
              <th>Response Time (ms)</th>
              <th>Client IP</th>
              <th>Logged At</th>
            </tr>
            ${recentLogs
              .map(log => `
                <tr>
                  <td>${log.method}</td>
                  <td>${log.path}</td>
                  <td>${log.status_code}</td>
                  <td>${log.response_time}</td>
                  <td>${log.ip_address}</td>
                  <td>${new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              `)
              .join('')}
          </table>
        </body>
      </html>
    `;

    res.send(htmlResponse);
  } catch (error) {
    console.error('Error while fetching logs:', error.message);
    res.status(500).send(`
      <h2 style="color:red; text-align:center;">Failed to retrieve logs</h2>
      <p style="text-align:center;">An error occurred while reading data from MongoDB.</p>
    `);
  }
});

// Start the dashboard server
app.listen(PORT, () => {
  console.log(`🚀 Dashboard is live at: http://localhost:${PORT}`);
});

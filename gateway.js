// require('dotenv').config();
// const express = require('express');
// const morgan = require('morgan');
// const axios = require('axios');
// const logger = require('./utils/logger');
// const connectDB = require('./utils/db');
// const RequestLog = require('./models/RequestLog');
// const { authenticate } = require('./middleware/auth');
// const { apiRateLimiter } = require('./middleware/rateLimiter');
// const { paymentLoadBalancer, refundLoadBalancer } = require('./utils/loadBalancer');

// const app = express();
// const PORT = 4000;
// connectDB();
// app.use(express.json());
// app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// // MongoDB logging middleware
// app.use((req, res, next) => {
//   const start = Date.now();
//   res.on('finish', async () => {
//     const responseTime = Date.now() - start;
//     await RequestLog.create({
//       user_id: req.user?.userId || null,
//       method: req.method,
//       path: req.path,
//       status_code: res.statusCode,
//       response_time: responseTime,
//       ip_address: req.ip,
//       user_agent: req.headers['user-agent'],
//     });
//   });
//   next();
// });

// // Routes
// app.get('/health', (req, res) => {
//   res.json({ status: 'healthy', service: 'api-gateway', port: PORT });
// });

// app.use('/api/payments', apiRateLimiter, authenticate, async (req, res) => {
//   const instance = paymentLoadBalancer.getNextInstance();
//   try {
//     const response = await axios({
//       method: req.method,
//       url: `${instance.url}${req.path}`,
//       data: req.body,
//     });
//     res.status(response.status).json(response.data);
//   } catch {
//     res.status(503).json({ error: 'Payment service unavailable' });
//   }
// });

// app.use('/api/refunds', apiRateLimiter, authenticate, async (req, res) => {
//   const instance = refundLoadBalancer.getNextInstance();
//   try {
//     const response = await axios({
//       method: req.method,
//       url: `${instance.url}${req.path}`,
//       data: req.body,
//     });
//     res.status(response.status).json(response.data);
//   } catch {
//     res.status(503).json({ error: 'Refund service unavailable' });
//   }
// });

// app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));


// gateway.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const logger = require('./utils/logger');
const connectDB = require('./utils/db');
const RequestLog = require('./models/RequestLog');
const { authenticate } = require('./middleware/auth');
const { apiRateLimiter } = require('./middleware/rateLimiter');
const { paymentLoadBalancer, refundLoadBalancer } = require('./utils/loadBalancer');
const { metricsMiddleware, register } = require('./middleware/metrics'); // 🆕 Metrics middleware

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// 🧠 Apply metrics middleware
app.use(metricsMiddleware);

// 🧾 MongoDB request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', async () => {
    const responseTime = Date.now() - start;
    await RequestLog.create({
      user_id: req.user?.userId || null,
      method: req.method,
      path: req.path,
      status_code: res.statusCode,
      response_time: responseTime,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
    });
  });
  next();
});

// ✅ Health route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'api-gateway', port: PORT });
});

// 📊 Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// 🧭 Payment routes
app.use('/api/payments', apiRateLimiter, authenticate, async (req, res) => {
  const instance = paymentLoadBalancer.getNextInstance();
  try {
    const response = await axios({
      method: req.method,
      url: `${instance.url}${req.path}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch {
    res.status(503).json({ error: 'Payment service unavailable' });
  }
});

// 💸 Refund routes
app.use('/api/refunds', apiRateLimiter, authenticate, async (req, res) => {
  const instance = refundLoadBalancer.getNextInstance();
  try {
    const response = await axios({
      method: req.method,
      url: `${instance.url}${req.path}`,
      data: req.body,
    });
    res.status(response.status).json(response.data);
  } catch {
    res.status(503).json({ error: 'Refund service unavailable' });
  }
});

app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));



const client = require('prom-client');

// Registry to store metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status_code']
});

const httpDuration = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'path', 'status_code'],
  buckets: [50, 100, 300, 500, 1000, 2000]
});

register.registerMetric(httpRequests);
register.registerMetric(httpDuration);

// Middleware to track each request
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequests.labels(req.method, req.path, res.statusCode).inc();
    httpDuration.labels(req.method, req.path, res.statusCode).observe(duration);
  });
  next();
};

module.exports = { metricsMiddleware, register };

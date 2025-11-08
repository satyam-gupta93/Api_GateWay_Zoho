# Payment API Gateway

A lightweight API Gateway built with Node.js and Express.js that routes requests to payment microservices with authentication, rate limiting, load balancing, and comprehensive logging.

## Architecture

```
Client Request
     ↓
API Gateway (Port 4000)
     ├─ Authentication (JWT/API Key)
     ├─ Rate Limiting (100 req/hour)
     ├─ Load Balancing (Round-robin)
     └─ Request Logging
          ↓
     ┌────┴────┐
     ↓         ↓
Service 1   Service 2
(Port 5001) (Port 5002)
     ↓         ↓
   Supabase Database
```

## Features

- **Authentication**: JWT tokens and API key support
- **Rate Limiting**: 100 requests per hour per IP
- **Load Balancing**: Round-robin distribution across service instances
- **Logging**: Winston and Morgan for comprehensive request tracking
- **Database**: Supabase PostgreSQL for data persistence
- **Monitoring**: Health endpoints and request logging

## Services

### Payment Service 1 (Port 5001)
- `POST /pay` - Process payment transactions
- `GET /status/:id` - Check payment status
- `GET /health` - Service health check

### Payment Service 2 (Port 5002)
- `POST /refund` - Process refund requests
- `GET /transactions` - List transactions
- `GET /health` - Service health check

### API Gateway (Port 4000)
- `POST /api/payments/pay` - Routes to Payment Service 1
- `GET /api/payments/status/:id` - Routes to Payment Service 1
- `POST /api/refunds/refund` - Routes to Payment Service 2
- `GET /api/refunds/transactions` - Routes to Payment Service 2
- `GET /health` - Gateway health check

## Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Seed the database**:
```bash
npm run seed
```

This creates a test user and API key.

3. **Generate a JWT token**:
```bash
npm run generate-token
```

## Running the System

### Start all services:
```bash
npm start
```

This starts:
- API Gateway on port 4000
- Payment Service 1 on port 5001
- Payment Service 2 on port 5002

### Start services individually:
```bash
npm run gateway    # API Gateway only
npm run service1   # Payment Service 1 only
npm run service2   # Payment Service 2 only
```

## API Usage

### Authentication

The API Gateway supports two authentication methods:

#### 1. JWT Token (Bearer)
```bash
curl -X POST http://localhost:4000/api/payments/pay \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "amount": 99.99,
    "currency": "USD",
    "paymentMethod": "credit_card"
  }'
```

#### 2. API Key
```bash
curl -X POST http://localhost:4000/api/payments/pay \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "amount": 99.99,
    "currency": "USD",
    "paymentMethod": "credit_card"
  }'
```

### Example Requests

#### Process Payment
```bash
curl -X POST http://localhost:4000/api/payments/pay \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "amount": 149.99,
    "currency": "USD",
    "paymentMethod": "credit_card"
  }'
```

#### Check Payment Status
```bash
curl http://localhost:4000/api/payments/status/PAYMENT_ID \
  -H "X-API-Key: YOUR_API_KEY"
```

#### Process Refund
```bash
curl -X POST http://localhost:4000/api/refunds/refund \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "PAYMENT_ID",
    "amount": 149.99,
    "reason": "Customer request"
  }'
```

#### List Transactions
```bash
curl http://localhost:4000/api/refunds/transactions?userId=USER_ID&limit=10 \
  -H "X-API-Key: YOUR_API_KEY"
```

#### Health Check
```bash
curl http://localhost:4000/health
```

## Database Schema

### Tables
- **users**: User accounts for authentication
- **api_keys**: API keys for service authentication
- **payments**: Payment transaction records
- **refunds**: Refund transaction records
- **request_logs**: API Gateway request logs

All tables have Row Level Security (RLS) enabled for data protection.

## Load Balancing

The gateway implements round-robin load balancing, distributing requests evenly across service instances. The load balancer maintains a list of available instances and cycles through them sequentially.

## Rate Limiting

- Default: 100 requests per hour per IP
- Configurable per route
- Health endpoints excluded from rate limiting

## Logging

### Winston Logger
- Structured JSON logging
- Timestamps and metadata
- Color-coded console output

### Morgan HTTP Logger
- HTTP request logging
- Response time tracking
- Combined log format

### Database Logging
All requests are logged to the `request_logs` table with:
- User ID
- HTTP method and path
- Response status and time
- IP address and user agent

## Security

- Row Level Security (RLS) on all database tables
- JWT token verification with expiration
- API key validation with usage tracking
- Rate limiting to prevent abuse
- Request logging for audit trails

## Extension Ideas

- Docker containerization
- Kubernetes orchestration
- Redis for rate limiting and caching
- Circuit breaker pattern for fault tolerance
- Prometheus metrics and Grafana dashboards
- Multiple payment gateway integrations
- WebSocket support for real-time updates

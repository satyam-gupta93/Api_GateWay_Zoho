# Scalable API Gateway with Microservices Architecture

## Overview
This project demonstrates the design and implementation of a scalable backend system using microservices architecture.

An API Gateway is used as a single entry point to manage and route requests to multiple backend services such as payment and refund services.

The system focuses on security, load balancing, monitoring, and scalability.

---

## Key Features

- Centralized API Gateway for request routing
- JWT-based authentication
- API key authorization
- Rate limiting to prevent excessive requests
- Round-robin load balancing
- Microservices-based architecture
- Monitoring using Grafana and InfluxDB
- Containerized deployment using Docker

---

## System Architecture

Client sends requests to API Gateway, which routes them to appropriate services:

Client → API Gateway → Services (Payment, Refund, etc.) → Database

---

## Tech Stack

Backend:
- Node.js
- Express.js

Database:
- MongoDB

Security:
- JWT Authentication
- API Key Authorization
- Rate Limiting

Monitoring:
- Grafana
- InfluxDB
- K6

DevOps:
- Docker
- Docker Compose

---

## How It Works

1. Client sends request to API Gateway
2. API Gateway verifies authentication using JWT or API Key
3. Rate limiting is applied
4. Request is routed to the correct microservice
5. Load balancer distributes requests across service instances
6. Service processes request and returns response

---

## Load Balancing

Round-robin algorithm is used:
- Requests are distributed sequentially across available servers
- Ensures equal load distribution
- Improves system availability

---

## Security

- JWT Authentication for user validation
- API Key Authorization for controlled access
- Rate limiting to prevent abuse and attacks

---

## Monitoring

Tools used:
- Grafana for visualization
- InfluxDB for storing metrics
- K6 for load testing

Metrics monitored:
- Request rate
- Response time
- System performance

---

## Services

Payment Service:
- Handles payment processing
- Supports multiple transaction states (pending, success, failed)

Refund Service:
- Handles refund workflows
- Tracks refund status

---

## Installation and Setup

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
docker-compose up --build



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

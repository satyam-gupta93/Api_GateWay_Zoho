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

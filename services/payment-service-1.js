require('dotenv').config();
const express = require('express');
const connectDB = require('../utils/db');
const Payment = require('../models/Payment');

// payment service - 1

const app = express();
const PORT = 5001;
app.use(express.json());

connectDB();

app.post('/pay', async (req, res) => {
  try {
    const { userId, amount, currency = 'USD', paymentMethod } = req.body;
    if (!userId || !amount || !paymentMethod)
      return res.status(400).json({ error: 'Missing required fields' });

    const payment = await Payment.create({
      user_id: userId,
      amount,
      currency,
      payment_method: paymentMethod,
      status: 'completed',
      service_instance: 'payment-service-1',
    });

    res.status(201).json({
      success: true,
      paymentId: payment._id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      processedBy: 'payment-service-1',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment failed' });
  }
});

app.get('/status/:id', async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  res.json(payment);
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'payment-service-1', port: PORT });
});

app.listen(PORT, () => console.log(`Payment Service 1 running on port ${PORT}`));

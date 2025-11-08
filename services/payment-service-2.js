require('dotenv').config();
const express = require('express');
const connectDB = require('../utils/db');
const Payment = require('../models/Payment');
const Refund = require('../models/Refund');

const app = express();
const PORT = 5002;
app.use(express.json());

connectDB();

app.post('/refund', async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    if (amount > payment.amount)
      return res.status(400).json({ error: 'Refund amount exceeds payment' });

    const refund = await Refund.create({
      payment_id: paymentId,
      amount,
      reason: reason || 'Customer request',
      status: 'completed',
      service_instance: 'payment-service-2',
    });

    res.status(201).json({
      success: true,
      refundId: refund._id,
      paymentId: refund.payment_id,
      amount: refund.amount,
      reason: refund.reason,
      status: refund.status,
      processedBy: 'payment-service-2',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Refund failed' });
  }
});

app.get('/transactions', async (req, res) => {
  const { userId, limit = 10, offset = 0 } = req.query;
  const query = userId ? { user_id: userId } : {};
  const payments = await Payment.find(query)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
  res.json({ transactions: payments, count: payments.length });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'payment-service-2', port: PORT });
});

app.listen(PORT, () => console.log(`💳 Payment Service 2 running on port ${PORT}`));

const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
  payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  amount: { type: Number, required: true },
  reason: String,
  status: { type: String, default: 'pending' },
  service_instance: String
}, { timestamps: true });

module.exports = mongoose.model('Refund', refundSchema);

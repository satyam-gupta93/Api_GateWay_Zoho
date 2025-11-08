const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, default: 'pending' },
  payment_method: { type: String, required: true },
  service_instance: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

const mongoose = require('mongoose');

// Request log

const requestLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  method: String,
  path: String,
  status_code: Number,
  response_time: Number,
  ip_address: String,
  user_agent: String,
}, { timestamps: true });

module.exports = mongoose.model('RequestLog', requestLogSchema);

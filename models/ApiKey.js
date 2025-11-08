const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  key_value: { type: String, unique: true, required: true },
  name: String,
  is_active: { type: Boolean, default: true },
  last_used_at: Date
}, { timestamps: true });

module.exports = mongoose.model('ApiKey', apiKeySchema);

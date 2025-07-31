// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: Number,
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);

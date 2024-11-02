// models/report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: { type: String, required: true }, // เปลี่ยนจาก reporter เป็น userEmail
  reason: { type: String, required: true },
  additionalInfo: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);

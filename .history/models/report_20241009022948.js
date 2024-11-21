// models/report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  User: { type: String, required: true }, // ใช้เป็นชื่อผู้ใช้ที่ถูกรายงาน
  userEmail: { type: String, required: true }, // เปลี่ยนจาก reporter เป็น userEmail
  reason: { type: String, required: true },
  additionalInfo: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);

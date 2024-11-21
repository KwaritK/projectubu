// models/report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportedUser: { type: String, required: true },
  reporter: { type: String, required: true },
  roomID: { type: String, required: true },
  reason: { type: String, required: true },
  additionalInfo: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);

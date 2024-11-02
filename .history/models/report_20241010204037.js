const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  reason: { 
    type: String, 
    required: true 
  },
  additionalInfo: { 
    type: String 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// ตรวจสอบว่า model 'Report' มีอยู่แล้วหรือไม่
module.exports = mongoose.models.Report || mongoose.model('Report', reportSchema);

module.exports = Room;
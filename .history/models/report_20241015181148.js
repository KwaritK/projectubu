const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportedUser: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  reportedBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

module.exports = mongoose.models.Report || mongoose.model('Report', reportSchema);
module.exports = Report;
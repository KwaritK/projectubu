const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: 
  { type: String, 
    required: true 
  },
  email: 
  { type: String, 
    required: true 
  },
  reason:
   { type: String, 
    required: true 
  },
  additionalInfo: 
  { type: String 

  },
  timestamp: 
  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
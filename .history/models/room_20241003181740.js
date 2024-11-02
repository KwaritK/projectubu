const mongoose = require('mongoose');
const RoomSchema = new mongoose.Schema({
  roomType: 
  { 
    type: String, 
    enum: ['one-on-one','multi'],
     required: true 
    }, 
     // กำหนดประเภทห้อง

  ageGroup: 
    { 
      type: String, 
      enum: ['high-school', 'university', 'working','any'],
       required: true 
      }, 
       // กำหนดช่วงอายุ
  
  roomID: 
  {
    type: String,
    required: true,
    unique: true, // กำหนดให้ roomID ไม่ซ้ำกัน
  },

  maxUsers: { 
    type: Number, 
    required: true 
    }
     // เพิ่มจำนวนผู้ใช้
});

const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);

module.exports = Room;
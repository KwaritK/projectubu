const mongoose = require('mongoose');
const RoomSchema = new mongoose.Schema({
  roomType: 
  { 
    type: String, 
    enum: ['one-on-one','multi'], // ระบุประเภทห้อง
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
    },
     // เพิ่มจำนวนผู้ใช้
     userCount: {
      type: Number,
      default: 0 // กำหนดค่าเริ่มต้นให้เป็น 0
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600 // ห้องจะถูกลบโดยอัตโนมัติหลังจาก 1 ชั่วโมง (60 นาที) หลังจากสร้างขึ้น (Optional)
    }
  });
  
  // สร้าง model

  


const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);

module.exports = Room;
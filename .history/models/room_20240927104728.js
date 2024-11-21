import mongoose from 'mongoose';
import mongoose,{ Schema } from "mongoose"

const RoomSchema = new mongoose.Schema({
  roomType: { 
    type: String, 
    enum: ['one-on-one', 'multi'], // ประเภทห้อง 
    required: true 
  }, 

  ageGroup: { 
    type: String, 
    enum: ['high-school', 'university', 'working', 'any'], // ช่วงอายุ 
    required: true 
  }, 
  
  roomID: { 
    type: String, 
    required: true, 
    unique: true 
  },

  usersCount: { 
    type: Number, 
    default: 0 // เริ่มต้นด้วย 0 เมื่อห้องถูกสร้าง
  },

  maxUsers: { 
    type: Number, 
    required: true, 
    default: function() { 
      return this.roomType === 'one-on-one' ? 2 : 5; // กำหนดจำนวนผู้ใช้สูงสุด
    }
  },
  lastActive: { type: Date, default: Date.now }, // เวลาสุดท้ายที่ห้องถูกใช้งาน
});

const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);

export default Room;

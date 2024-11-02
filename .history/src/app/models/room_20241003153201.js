import mongoose from 'mongoose';

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
    unique: true,
  },

  maxUsers: 
  { type: Number, 
    required: true, 
     } // เพิ่มจำนวนผู้ใช้สูงสุด
});

const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);

export default Room;
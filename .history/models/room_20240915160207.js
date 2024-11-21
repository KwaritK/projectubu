import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomType: 
  { type: String, 
    enum: ['multi', 'one-on-one'], required: true }, 
     // กำหนดประเภทห้อง
     ageGroup: 
     { type: String, 
      enum: ['30-40', '20-25', 'any'], required: true },  // กำหนดช่วงอายุ
  
  roomID: {
    type: String,
    required: true,
    unique: true,
  },
});

const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);

export default Room;

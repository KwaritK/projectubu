import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomType: 
  { type: String, 
    enum: ['multi', 'one-on-one'], required: true }, 
     // กำหนดประเภทห้อง
  ageRestriction: {
    type: String,
    required: false,
  },
  
  roomID: {
    type: String,
    required: true,
    unique: true,
  },
});

const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);

export default Room;

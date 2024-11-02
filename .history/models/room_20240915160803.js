import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomType: 
  { type: String, 
    enum: ['one-on-one','multi'],
     required: true }, 
     // กำหนดประเภทห้อง
     
     ageGroup: 
     { type: String, 
      enum: ['any','high-school', 'university', 'working'],
       required: true }, 
       // กำหนดช่วงอายุ
  
  roomID: {
    type: String,
    required: true,
    unique: true,
  },
});

const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);

export default Room;

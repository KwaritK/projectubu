const RoomSchema = new mongoose.Schema({
  roomType: { 
    type: String, 
    enum: ['one-on-one', 'multi'],
    required: true 
  }, 
  ageGroup: { 
    type: String, 
    enum: ['high-school', 'university', 'working', 'any'],
    required: true 
  }, 
  roomID: {
    type: String,
    required: true,
    unique: true,
  },
  users: {
    type: [String], // เก็บ user IDs หรือ usernames ของผู้ใช้ในห้อง
    default: [],
  },
  maxUsers: { 
    type: Number,
    required: true,
  },
});

const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);

export default Room;

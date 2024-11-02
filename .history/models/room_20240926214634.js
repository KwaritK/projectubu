import mongoose from 'mongoose';

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
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxParticipants: {
    type: Number,
    required: true,
    default: function() {
      return this.roomType === 'one-on-one' ? 2 : 5;
    }
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 24*60*60*1000) // 24 hours from now
  }
}, { timestamps: true });

// เพิ่มการตรวจสอบจำนวนผู้เข้าร่วม
RoomSchema.path('participants').validate(function(value) {
  return value.length <= this.maxParticipants;
}, 'จำนวนผู้เข้าร่วมเกินกว่าที่กำหนด');

// เพิ่มดัชนี
RoomSchema.index({ roomType: 1, ageGroup: 1 });

const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);

export default Room;
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
  }
});

const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);

export default Room;
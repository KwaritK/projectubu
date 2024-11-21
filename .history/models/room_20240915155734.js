import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  romm
  ageRestriction: {
    type: String,
    required: false,
  },
  roomType: {
    type: String,
    required: true,
  },
  roomID: {
    type: String,
    required: true,
    unique: true,
  },
});

const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);

export default Room;

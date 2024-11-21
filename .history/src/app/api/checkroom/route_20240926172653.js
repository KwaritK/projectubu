import { connectMongoDB } from '../../../../lib/mongodb';
import Room from '../../../../models/room';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const roomCode = searchParams.get('roomCode');

  try {
    await connectMongoDB();
    
    const room = await Room.findOne({ roomID: roomCode });
    
    if (room) {
      const currentParticipants = room.participants.length;
      const maxParticipants = room.maxParticipants;
      const canJoin = currentParticipants < maxParticipants;

      return new Response(JSON.stringify({ 
        exists: true, 
        canJoin,
        currentParticipants,
        maxParticipants,
        roomType: room.roomType,
        ageGroup: room.ageGroup
      }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ exists: false }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
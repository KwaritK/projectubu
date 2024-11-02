import { connectMongoDB } from '../../../../lib/mongodb';
import Room from '../../../../models/room'; // Assuming you have a Room model

export async function GET(req, { params }) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    const { roomCode } = params;

    // Find room by roomID
    const room = await Room.findOne({ roomID: roomCode });

    if (room) {
      return new Response(JSON.stringify(room), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Room not found' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

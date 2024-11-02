import { connectMongoDB } from '../../../../lib/mongodb';
import Room from '../../../../models/room';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const roomCode = searchParams.get('roomCode');

  try {
    await connectMongoDB();
    
    const room = await Room.findOne({ roomID: roomCode });
    
    if (room) {
      return new Response(JSON.stringify({ exists: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ exists: false }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}โค้ด api/checkroom
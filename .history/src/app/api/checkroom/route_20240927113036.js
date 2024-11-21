import { connectMongoDB } from '../../../../lib/mongodb';
import Room from '../../../../models/room'; // เปลี่ยนจาก require เป็น import

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const roomCode = searchParams.get('roomCode');

  try {
    await connectMongoDB();
    
    const room = await Room.findOne({ roomID: roomCode });

    if (room) {
      if (room.usersCount < room.maxUsers) {
        return new Response(JSON.stringify({ exists: true }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ exists: false, error: "Room is full" }), { status: 403 });
      }
    } else {
      return new Response(JSON.stringify({ exists: false }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

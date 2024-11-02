import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(req, { params }) {
  const { roomCode } = params;

  const { db } = await connectToDatabase();
  const room = await db.collection('rooms').findOne({ roomID: roomCode });

  if (room) {
    return new Response(JSON.stringify(room), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: 'Room not found' }), { status: 404 });
  }
}

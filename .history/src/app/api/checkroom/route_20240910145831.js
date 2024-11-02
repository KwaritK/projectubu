import { connectToDatabase } from '../../../../utils/mongodb';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const roomID = searchParams.get('roomID');

  const { db } = await connectToDatabase();
  const room = await db.collection('rooms').findOne({ roomID });

  if (room) {
    return new Response(JSON.stringify(room), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: 'Room not found' }), { status: 404 });
  }
}

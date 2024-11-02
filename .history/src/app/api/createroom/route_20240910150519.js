import { connectToDatabase } from '../../../../lib/mongodb';

export async function POST(req, res) {
  const { roomName, ageRestriction, roomType } = await req.json();

  // Generate a random room ID
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let roomID = '';
  const length = 8;
  for (let i = 0; i < length; i++) {
    roomID += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const { db } = await connectToDatabase();

  const newRoom = {
    roomName,
    ageRestriction,
    roomType,
    roomID,
  };

  // Insert the new room into the database
  await db.collection('rooms').insertOne(newRoom);

  return new Response(JSON.stringify({ success: true, roomID }), {
    status: 200,
  });
}

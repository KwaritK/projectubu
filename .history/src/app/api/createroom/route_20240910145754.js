import { connectToDatabase } from '../../../../utils/mongodb';

export async function POST(req) {
  const { roomName, ageRestriction, roomType } = await req.json();
  
  const roomID = generateRoomID();

  const { db } = await connectToDatabase();
  const result = await db.collection('rooms').insertOne({
    roomName,
    ageRestriction,
    roomType,
    roomID,
  });

  return new Response(JSON.stringify({ success: true, roomID }), { status: 200 });
}

// Helper function to generate random room ID
function generateRoomID() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let roomID = '';
  const length = 8;
  for (let i = 0; i < length; i++) {
    roomID += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return roomID;
}

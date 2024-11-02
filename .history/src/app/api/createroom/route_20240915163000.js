import { connectMongoDB } from '../../../../lib/mongodb';
import Room from '../../../../models/room'; // Assuming you have a Room model

export async function POST(req, res) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Parse request body
    const { roomName, ageRestriction, roomType } = await req.json();

    // Generate a random room ID
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomID = '';
    const length = 8;
    for (let i = 0; i < length; i++) {
      roomID += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Create and save the room
    const newRoom = new Room({
      roomName,
      ageRestriction,
      roomType,
      roomID,
    });

    await newRoom.save();

    return new Response(JSON.stringify({ success: true, roomID }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

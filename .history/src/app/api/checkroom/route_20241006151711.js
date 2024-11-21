import { connectMongoDB } from '../../../../lib/mongodb';
import Room from '../../../../models/room';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const roomCode = searchParams.get('roomCode');

  try {
    await connectMongoDB();
    
    const room = await Room.findOne({ roomID: roomCode });
    
    if (!room) {
      return new Response(JSON.stringify({ exists: false }), { status: 404 });
    }
    
    // เช็คว่าห้องเต็มหรือไม่
     // ใช้ userCount จากฐานข้อมูลโดยตรง
     if (room.userCount >= room.maxUsers) {
      return new Response(JSON.stringify({ error: "Room is full." }), { status: 400 });
    }
    
    // ห้องยังไม่เต็ม ส่งข้อมูลห้องกลับไป
    return new Response(JSON.stringify({ exists: true, room }), { status: 200 });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
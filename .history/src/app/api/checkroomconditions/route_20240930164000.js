import { connectMongoDB } from '../../../../lib/mongodb';
import Room from '../../../../models/room';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const roomCode = searchParams.get('roomCode');

  try {
    await connectMongoDB();
    
    const room = await Room.findOne({ roomID: roomCode });
    
    if (room) {
      // ตรวจสอบเงื่อนไขต่างๆ
      const userCount = await getUserCount(roomCode);
      const canJoin = (room.roomType === 'one-on-one' && userCount < 2) ||
                      (room.roomType === 'multi' && userCount < 5);
      
      return new Response(JSON.stringify({ canJoin }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ canJoin: false }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

async function getUserCount(roomCode) {
  // ดึงจำนวนผู้ใช้ในห้องจาก database หรือ cache
  // ต้องมีการเก็บข้อมูลนี้เมื่อผู้ใช้เข้าหรือออกจากห้อง
}
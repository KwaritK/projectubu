export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const roomCode = searchParams.get('roomCode');

  try {
    await connectMongoDB();
    
    const room = await Room.findOne({ roomID: roomCode });

    if (room) {
      // ตรวจสอบว่าจำนวนผู้ใช้ในห้องถึงขีดจำกัดหรือยัง
      if (room.users.length >= room.maxUsers) {
        return new Response(JSON.stringify({ exists: true, full: true }), { status: 403 }); // ห้องเต็ม
      }

      return new Response(JSON.stringify({ exists: true, full: false }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ exists: false }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

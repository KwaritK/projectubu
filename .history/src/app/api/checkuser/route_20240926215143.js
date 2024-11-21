export async function POST(req) {
    try {
      await connectMongoDB();
      const { roomCode, userID } = await req.json();
  
      const room = await Room.findOne({ roomID: roomCode });
  
      if (!room) {
        return new Response(JSON.stringify({ error: "Room not found." }), { status: 404 });
      }
  
      if (room.users.length >= room.maxUsers) {
        return new Response(JSON.stringify({ error: "Room is full." }), { status: 403 });
      }
  
      room.users.push(userID); // เพิ่มผู้ใช้ใหม่เข้าไปในห้อง
      await room.save();
  
      return new Response(JSON.stringify({ success: true, room }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  }
  
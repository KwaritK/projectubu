import { connectMongoDB } from '../../../../lib/mongodb';
import Room from '../../../../models/room';

function generateRoomID(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function POST(req) {
  try {
    await connectMongoDB();

    const { roomType, ageGroup, userId } = await req.json();

    if (!roomType || !ageGroup ) {
      return new Response(JSON.stringify({ error: "Room type, age group, and user ID are required." }), { status: 400 });
    }

      // ตรวจสอบห้องที่มีอยู่แล้วและยังมีที่ว่าง
      const existingRoom = await Room.findOne({
        roomType,
        ageGroup,
        $expr: { $lt: [{ $size: "$participants" }, "$maxParticipants"] }
      });
  
      if (existingRoom && userId) {
        // เพิ่มผู้ใช้เข้าห้องที่มีอยู่แล้ว ถ้ามี userId
        if (!existingRoom.participants.includes(userId)) {
          existingRoom.participants.push(userId);
          await existingRoom.save();
        }
        return new Response(JSON.stringify({ room: existingRoom, joined: true }), { status: 200 });
      }

    // สร้างห้องใหม่ถ้าไม่มีห้องที่เหมาะสม
    const newRoom = new Room({
      roomType,
      ageGroup,
      roomID: generateRoomID(5),
      participants: userId ? [userId] : [],
    });


    await newRoom.save();

    return new Response(JSON.stringify({ room: newRoom, created: true }), { status: 201 });
  } catch (error) {
    console.error("Error creating/joining room:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
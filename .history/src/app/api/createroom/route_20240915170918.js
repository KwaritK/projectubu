import { connectMongoDB } from '../../../../lib/mongodb';
import Room from '../../../../models/room'; // นำเข้า Schema ห้องที่คุณสร้างไว้


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
    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();

    // ดึงข้อมูลจาก request body
    const { roomType, ageGroup } = await req.json();

    // ตรวจสอบว่าข้อมูลถูกต้อง
    if (!roomType || !ageGroup) {
      return new Response(JSON.stringify({ error: "Room type and age group are required." }), { status: 400 });
    }

    // สร้าง Room ใหม่
    const newRoom = new Room({
      roomType,
      ageGroup,
      roomID: generateRoomID(), // สร้าง roomID แบบสุ่ม
    });

    // บันทึก Room ลง MongoDB
    await newRoom.save();

    // ส่งค่ากลับเมื่อสร้างห้องสำเร็จ
    return new Response(JSON.stringify({ room: newRoom }), { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
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
    const { roomType, ageGroup } = await req.json(); //จะดึง roomType และ ageGroup จาก request body ซึ่งถูกส่งมาจาก client เมื่อมีการสร้างห้อง

    // ตรวจสอบว่าข้อมูลถูกต้อง
    if (!roomType || !ageGroup) {
      return new Response(JSON.stringify({ error: "Room type and age group are required." }), { status: 400 });
    }
    // กำหนดจำนวนผู้ใช้สูงสุดตามประเภทห้อง
    const maxUsers = roomType === 'one-on-one' ? 2 : 5;

    // ค้นหาห้องที่มีประเภทเดียวกันและช่วงอายุเดียวกันที่ยังไม่เต็ม
    let room = await Room.findOne({ roomType, ageGroup });

    if (room) {
      // ตรวจสอบจำนวนผู้ใช้ปัจจุบันในห้อง
      const currentUserCount = room.userCount;

      // ตรวจสอบว่าห้องเต็มหรือไม่
      if (currentUserCount < room.maxUsers) {
        // อัปเดตจำนวนผู้ใช้ในห้อง
        room.userCount += 1;
        await room.save();

        // ส่งข้อมูลห้องกลับไปเมื่อเข้าร่วมห้องสำเร็จ
        return new Response(JSON.stringify({ room }), { status: 200 });
      } 
      
    }
    // สร้างห้องใหม่หากไม่มีห้องที่ตรงตามเงื่อนไขหรือห้องเต็ม
    const newRoom = new Room({
      roomType,
      ageGroup,
      roomID: generateRoomID(5),// สร้าง roomID แบบสุ่มไม่เกิน 5 อักขระ
      maxUsers,
      userCount: 1 //แก้ตรงนี้ ควรปรับเป็นแบบยืดยุ่นหากผู้ใช้สร้างแล้วไม่ได้ทำการเข้าร่วมควรเป็น 0 !!
      users:
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
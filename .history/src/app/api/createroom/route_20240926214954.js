export async function POST(req) {
  try {
    await connectMongoDB();
    const { roomType, ageGroup } = await req.json();

    if (!roomType || !ageGroup) {
      return new Response(JSON.stringify({ error: "Room type and age group are required." }), { status: 400 });
    }

    // กำหนดจำนวนผู้ใช้สูงสุดตามประเภทห้อง
    const maxUsers = roomType === 'one-on-one' ? 2 : 5;

    const newRoom = new Room({
      roomType,
      ageGroup,
      roomID: generateRoomID(5),
      maxUsers, // เพิ่ม maxUsers
    });

    await newRoom.save();

    return new Response(JSON.stringify({ room: newRoom }), { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

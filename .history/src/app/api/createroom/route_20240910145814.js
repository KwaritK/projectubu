import { connectToDatabase } from '@/utils/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { roomName, roomCode, ageRestriction, roomType } = req.body;
    const { db } = await connectToDatabase();

    // ตรวจสอบว่ามีรหัสห้องซ้ำหรือไม่
    const existingRoom = await db.collection('rooms').findOne({ roomCode });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room code already exists' });
    }

    // บันทึกห้องใหม่ลงในฐานข้อมูล
    const newRoom = {
      roomName,
      roomCode,
      ageRestriction,
      roomType,
      createdAt: new Date(),
    };

    await db.collection('rooms').insertOne(newRoom);

    res.status(201).json(newRoom);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// /api/check-room.js
import { connectToDatabase } from '@/utils/mongodb';

export default async function handler(req, res) {
  const { roomCode } = req.query;
  const { db } = await connectToDatabase();

  // ตรวจสอบว่ามีรหัสห้องในฐานข้อมูลหรือไม่
  const room = await db.collection('rooms').findOne({ roomCode });

  if (room) {
    res.status(200).json({ exists: true });
  } else {
    res.status(404).json({ exists: false });
  }
}

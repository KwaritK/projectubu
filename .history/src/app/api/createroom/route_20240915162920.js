import { connectMongoDB } from '../../../../lib/mongodb';
import Room from '../../../../models/room'; // นำเข้า Schema ห้องที่คุณสร้างไว้
import { v4 as uuidv4 } from 'uuid'; // ใช้สำหรับสร้าง roomID แบบสุ่ม

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // ดึงข้อมูลจาก request body
    const { roomType, ageGroup } = req.body;

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบหรือไม่
    if (!roomType || !ageGroup) {
      return res.status(400).json({ error: 'roomType and ageGroup are required' });
    }

    // สร้าง roomID แบบสุ่ม
    const roomID = uuidv4();

    // สร้างห้องใหม่
    const newRoom = new Room({
      roomType,
      ageGroup,
      roomID,
    });

    try {
      // บันทึกห้องลงในฐานข้อมูล MongoDB
      await newRoom.save();

      // ส่งกลับข้อมูลห้องที่สร้าง
      res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (error) {
      console.error('Error creating room:', error);
      res.status(500).json({ error: 'Error creating room' });
    }
  } else {
    // ส่งกลับ error หากเป็น method อื่นนอกจาก POST
    res.status(405).json({ error: 'Method not allowed' });
  }
}

import { connectMongoDB } from '../../../lib/mongodb';
import User from '../../../models/user';
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  // อนุญาตเฉพาะเมธอด POST เท่านั้น
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'อนุญาตเฉพาะเมธอด POST เท่านั้น' });
  }

  try {
    // ตรวจสอบ JWT token เพื่อยืนยันตัวตนผู้ใช้
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return res.status(401).json({ error: 'ไม่ได้รับอนุญาต' });
    }

    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();

    // ดึง userId จาก request body
    const { userId } = req.body;
    
    // ตรวจสอบว่ามีการส่ง userId มาหรือไม่
    if (!userId) {
      return res.status(400).json({ error: 'จำเป็นต้องระบุ User ID' });
    }

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
    }

    // ตรวจสอบว่าผู้ใช้ถูกแบนหรือไม่ และตรวจสอบว่ายังอยู่ในช่วงเวลาถูกแบนหรือไม่
    const isBanned = user.isBanned && user.banEnd > new Date();

    // ส่งผลลัพธ์กลับมาพร้อมกับสถานะการแบนและวันสิ้นสุดการแบน (ถ้ามี)
    return res.status(200).json({ 
      isBanned,
      banEnd: isBanned ? user.banEnd : null
    });

  } catch (error) {
    console.error('เกิดข้อผิดพลาดใน checkBanStatus:', error);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์' });
  }
}
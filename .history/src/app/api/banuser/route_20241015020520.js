import { connectMongoDB } from "../../../../lib/mongodb";
import User from '../../../models/user';


export default async function handler(req, res) {
  await connectMongoDB(); // เชื่อมต่อกับ MongoDB

  if (req.method === 'POST' && req.url === '/api/banUser') {
    // ฟังก์ชันแบนผู้ใช้
    const { userId, days, hours, minutes } = req.body;

    // คำนวณระยะเวลาแบน
    const totalMinutes = (days * 1440) + (hours * 60) + minutes;
    const banEndDate = new Date();
    banEndDate.setMinutes(banEndDate.getMinutes() + totalMinutes); // ตั้งเวลาสิ้นสุดการแบน

    try {
      const user = await User.findByIdAndUpdate(userId, {
        isBanned: true,
        banEnd: banEndDate,
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User banned successfully', banEnd: banEndDate });
    } catch (error) {
      console.error('Error banning user:', error);
      res.status(500).json({ error: 'Failed to ban user' });
    }
  } else if (req.method === 'POST' && req.url === '/api/unbanUser') {
    // ฟังก์ชันยกเลิกแบนผู้ใช้
    const { userId } = req.body; // รับ userId มาจาก request body

    try {
      const user = await User.findByIdAndUpdate(userId, {
        isBanned: false,
        banEnd: null,
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User unbanned successfully' });
    } catch (error) {
      console.error('Error unbanning user:', error);
      res.status(500).json({ error: 'Failed to unban user' });
    }
  } else {
    // อนุญาตเฉพาะการเรียก POST
    res.status(405).json({ message: 'Method not allowed' });
  }
}

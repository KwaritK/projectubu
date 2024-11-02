import { connectMongoDB } from "../../../../lib/mongodb";
import User from '../../../models/user';

export default async function handler(req, res) {
  const { userId, duration } = req.body;

  await connectMongoDB();

  if (req.method === 'POST') {
    const { action } = req.query;

    if (action === 'ban') {
      // ฟังก์ชันแบนผู้ใช้
      const banEndDate = new Date();
      banEndDate.setHours(banEndDate.getHours() + duration);

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
    } else if (action === 'unban') {
      // ฟังก์ชันยกเลิกแบนผู้ใช้
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
      res.status(400).json({ message: 'Invalid action' });
    }
  } else {
    // อนุญาตเฉพาะการเรียก POST
    res.status(405).json({ message: 'Method not allowed' });
  }
}

import { connectMongoDB } from '../../../lib/mongodb';
import User from '../../../models/user';
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await connectMongoDB();
      const { userId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ 
        isBanned: user.isBanned && user.banEnd > new Date(),
        banEnd: user.banEnd
      });
    } catch (error) {
      console.error('Error in checkBanStatus:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
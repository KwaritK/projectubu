import { connectMongoDB } from '../../../lib/mongodb';
import User from '../../../models/user';
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await connectMongoDB();

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isBanned = user.isBanned && user.banEnd > new Date();

    return res.status(200).json({ 
      isBanned,
      banEnd: isBanned ? user.banEnd : null,
      reason: isBanned ? user.banReason : null
    });

  } catch (error) {
    console.error('Error in checkBanStatus:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
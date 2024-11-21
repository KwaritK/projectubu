import { connectMongoDB } from '../../../lib/mongodb';
import User from '../../../models/user';
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  console.log('checkBanStatus API called');
  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('Token found:', token ? 'Yes' : 'No');
    if (!token) {
      console.log('Unauthorized: No token found');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await connectMongoDB();

    const { userId } = req.body;
    console.log('Checking ban status for user:', userId);
    
    if (!userId) {
      console.log('User ID is missing');
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(userId);
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const isBanned = user.isBanned && user.banEnd > new Date();
    console.log('User ban status:', isBanned ? 'Banned' : 'Not banned');
    console.log('Ban end date:', user.banEnd);

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
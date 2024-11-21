import { NextResponse } from 'next/server';
import { connectMongoDB } from "../../../../lib/mongodb";
import User from '../../../../models/user';
import Report from '../../../../models/report';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from 'mongoose';
import { Server as SocketServer } from 'socket.io';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectMongoDB();
    const { userId, days, hours, minutes, reason } = await request.json();

    if (!userId || (days === undefined && hours === undefined && minutes === undefined)) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const totalMinutes = (days * 1440) + (hours * 60) + Number(minutes);
    const banEndDate = new Date(Date.now() + totalMinutes * 60000);

    const user = await User.findByIdAndUpdate(userId, 
      {
      isBanned: true,
      banEnd: banEndDate,
      $inc: { banCount: 1 },
      $push: {
        banHistory: {
          reason: reason || 'No reason provided',
          bannedAt: new Date(),
          bannedUntil: banEndDate,
          bannedBy: session.user.id
        }
      }
    }, { new: true });

    if (user) {
      await Report.updateMany({ reportedUser: userId, status: 'pending' }, { status: 'banned' });
      console.log(User with ID ${userId} updated:, user);
      
      
      const io = new SocketServer(global.server);
      io.to(userId).emit('userBanned', { reason, banEndDate });
    }

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User banned successfully', banEnd: banEndDate });
  } catch (error) {
    console.error('Error banning user:', error);
    return NextResponse.json({ message: 'Failed to ban user' }, { status: 500 });
  }
}
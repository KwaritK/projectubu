import { NextResponse } from 'next/server';
import { connectMongoDB } from "../../../../lib/mongodb";                   
import Report from "../../../../models/report";
import User from "../../../../models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectMongoDB();
    const { reportedUserEmail, reason, additionalInfo } = await request.json();

    if (!reportedUserEmail || !reason) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!isValidEmail(reportedUserEmail) || !isValidEmail(session.user.email)) {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    if (reportedUserEmail === session.user.email) {
      return NextResponse.json({ message: 'You cannot report yourself' }, { status: 400 });
    }

    const reportedUser = await User.findOne({ email: reportedUserEmail });
    if (!reportedUser) {
      return NextResponse.json({ message: 'Reported user not found' }, { status: 404 });
    }

    const reportingUser = await User.findOne({ email: session.user.email });
    if (!reportingUser) {
      return NextResponse.json({ message: 'Reporting user not found' }, { status: 404 });
    }

    const newReport = new Report({
      reportedUser: reportedUser._id,
      reportedBy: reportingUser._id,
      reason,
      additionalInfo,
      status: 'pending'
    });
    await newReport.save();

    // Increment the report count for the reported user
    await User.findByIdAndUpdate(reportedUser._id, { $inc: { reportCount: 1 } });
    
    return NextResponse.json({ message: 'Report saved successfully' }, { status: 201 });
  } catch (error) {
    console.error("Error saving report:", error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to save report' }, { status: 500 });
  }
}
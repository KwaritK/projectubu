import { NextResponse } from 'next/server';
import { connectMongoDB } from "../../../../lib/mongodb";                   
import Report from "../../../../models/report";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// GET: ดึงข้อมูลรีพอร์ตทั้งหมดสำหรับแอดมิน
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Full session object in API route:", JSON.stringify(session, null, 2));

    if (!session) {
      console.log("No session found in API route");
      return NextResponse.json({ message: 'Unauthorized - No session' }, { status: 403 });
    }

    if (!session.user || session.user.role !== 'admin') {
      console.log("User is not admin. Session user:", JSON.stringify(session.user, null, 2));
      return NextResponse.json({ message: 'Unauthorized - Not admin' }, { status: 403 });
    }

    console.log("User is authorized as admin");

    await connectMongoDB();
    const reports = await Report.find({});
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error in GET /api/report:", error);
    return NextResponse.json({ message: 'Failed to retrieve reports', error: error.message }, { status: 500 });
  }
}

// POST: บันทึกข้อมูลการรีพอร์ต
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectMongoDB();
    const { user, email, reason, additionalInfo } = await request.json();

    if (!user || !email || !reason) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    const newReport = new Report({
      user,
      email,
      reason,
      additionalInfo,
    });
    await newReport.save();
    
    return NextResponse.json({ message: 'Report saved successfully' }, { status: 201 });
  } catch (error) {
    console.error("Error saving report:", error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to save report' }, { status: 500 });
  }
}
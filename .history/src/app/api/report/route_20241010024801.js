import { NextResponse } from 'next/server';
import { connectMongoDB } from "../../../../lib/mongodb";
import Report from "../../../../models/พำ";

// GET: ดึงข้อมูลรีพอร์ตทั้งหมดสำหรับแอดมิน
export async function GET(request) {
  try {
    await connectMongoDB(); // เชื่อมต่อกับฐานข้อมูล
    const reports = await Report.find({});
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error retrieving reports:", error);
    return NextResponse.json({ message: 'Failed to retrieve reports' }, { status: 500 });
  }
}

// POST: บันทึกข้อมูลการรีพอร์ต
export async function POST(request) {
  try {
    await connectMongoDB(); // เชื่อมต่อกับฐานข้อมูล
    const { user, email, reason, additionalInfo } = await request.json();
    
    const newReport = new Report({
      user,
      email,
      reason,
      additionalInfo,
    });
    await newReport.save();
    
    console.log("Report saved successfully");
    return NextResponse.json({ message: 'Report saved successfully' }, { status: 201 });
  } catch (error) {
    console.error("Error saving report:", error);
    return NextResponse.json({ message: 'Failed to save report' }, { status: 500 });
  }
}
/ api/check/route.js
import { NextResponse } from 'next/server'
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email } = await req.json();
        const user = await User.findOne({ email }).select("_id");
        console.log("ผู้ใช้: ", user);

        return NextResponse.json({ user });
    } catch(error) {
        console.error("เกิดข้อผิดพลาดใน /api/check:", error);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดขณะตรวจสอบผู้ใช้" }, { status: 500 });
    }
}
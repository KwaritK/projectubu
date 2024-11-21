/ api/check/route.js
import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email } = await req.json();
        
        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: "อีเมลไม่ถูกต้อง" }, { status: 400 });
        }
        
        const user = await User.findOne({ email }).select("_id");
        console.log("ผู้ใช้:", user);

        return NextResponse.json({ user });
    } catch (error) {
        console.error("เกิดข้อผิดพลาดใน /api/check:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการตรวจสอบผู้ใช้" }, { status: 500 });
    }
}
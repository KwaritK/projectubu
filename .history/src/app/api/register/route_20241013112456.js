// api/register/route.js
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import bcrypt from 'bcryptjs'

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        await connectMongoDB();
        const newUser = await User.create({ email, password: hashedPassword });

        return NextResponse.json({ message: "ลงทะเบียนผู้ใช้สำเร็จ", user: newUser }, { status: 201 });
    } catch(error) {
        console.error("เกิดข้อผิดพลาดใน /api/register:", error);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดขณะลงทะเบียนผู้ใช้" }, { status: 500 });
    }
}
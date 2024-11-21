// middleware.js
import re
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token) {
    const { isBanned, banEnd } = token;

    // ถ้าผู้ใช้ถูกแบน และยังไม่พ้นช่วงเวลาการแบน
    if (isBanned && new Date(banEnd) > new Date()) {
      const url = req.nextUrl.clone();
      url.pathname = "/banned"; // เปลี่ยนเส้นทางไปที่หน้าบัญชีถูกแบน
      url.search = `?endDate=${encodeURIComponent(banEnd)}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|api|banned).*)'], // ยกเว้นหน้า login, api, และ banned
};

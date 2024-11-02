// src/middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
  }

  return NextResponse.next();
}

// ใช้ matcher เพื่อตรวจสอบเฉพาะ API เส้นทาง /api/report
export const config = {
  matcher: ['/api/report/:path*'],
};

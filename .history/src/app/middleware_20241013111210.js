import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // ตรวจสอบว่ามี token และบทบาทเป็น 'admin'
  if (!token || token.role !== 'admin') {
    // ถ้าเป็นการเรียก API ให้ส่ง JSON response
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }
    // ถ้าเป็นการเข้าถึงหน้า Admin ให้ redirect ไปยังหน้า login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// ใช้ matcher เพื่อตรวจสอบทั้ง API และหน้า Admin
export const config = {
  matcher: ['/api/report/:path*', '/admin/:path*'],
};
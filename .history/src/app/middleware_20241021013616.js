import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token) {
    try {
      // ตรวจสอบสถานะแบนผ่าน API
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/checkBanStatus, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': Bearer ${token.token}
        },
        body: JSON.stringify({ userId: token.id }),
      });

      if (!response.ok) {
        console.error('Failed to check ban status:', response.status);
        throw new Error('Failed to check ban status');
      }

      const data = await response.json();
      if (data.isBanned) {
        // ถ้าผู้ใช้ถูกแบน ให้ทำการ sign out และ redirect ไปยังหน้า login พร้อมแจ้งเตือน
        await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signout, { method: 'POST' });
        return NextResponse.redirect(`new URL(/login?error=${encodeURIComponent('บัญชีของคุณถูกระงับการใช้งาน')}, req.url`));
      }
    } catch (error) {
      console.error('Error checking ban status:', error);
      // Sign out ผู้ใช้เมื่อเกิดข้อผิดพลาด
      await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signout, { method: 'POST' });
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/map',  '/((?!api|_next/static|_next/image|favicon.ico).*)', '/api/protected/:path*'],
};
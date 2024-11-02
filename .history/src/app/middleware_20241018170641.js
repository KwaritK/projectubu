import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token) {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/checkBanStatus`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.token}`
        },
        body: JSON.stringify({ userId: token.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to check ban status');
      }

      const data = await response.json();
      if (data.isBanned) {
        // ทำการ sign out user และ redirect ไปยังหน้า login พร้อมข้อความแจ้งเตือน
        await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signout`, { method: 'POST' });
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent('บัญชีของคุณถูกระงับการใช้งาน')}`, req.url));
      }
    } catch (error) {
      console.error('Error checking ban status:', error);
      // ในกรณีที่เกิดข้อผิดพลาด ให้ sign out user เพื่อความปลอดภัย
      await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signout`, { method: 'POST' });
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
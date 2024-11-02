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
          'Authorization': `Bearer ${token.token}` // เพิ่ม token เพื่อ authenticate request
        },
        body: JSON.stringify({ userId: token.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to check ban status');
      }

      const data = await response.json();
      if (data.isBanned) {
        return NextResponse.redirect(new URL('/banned', req.url));
      }
    } catch (error) {
      console.error('Error checking ban status:', error);
      // อาจจะ redirect ไปยังหน้า error หรือ logout user
      return NextResponse.redirect(new URL('/error', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/map', '/profile', '/api/protected/:path*'],
};
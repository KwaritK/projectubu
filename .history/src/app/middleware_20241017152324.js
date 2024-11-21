import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token) {
    const user = await fetch(`${process.env.NEXTAUTH_URL}/api/checkBanStatus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: token.sub }),
    }).then(res => res.json());

    if (user.isBanned) {
      return NextResponse.redirect(new URL('/banned', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/map'],
};
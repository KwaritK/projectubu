import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  console.log('Middleware called for path:', req.nextUrl.pathname);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log('Token found:', token ? 'Yes' : 'No');

  if (token) {
    try {
      console.log('Checking ban status for user:', token.id);
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/checkBanStatus`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.token}`
        },
        body: JSON.stringify({ userId: token.id }),
      });

      if (!response.ok) {
        console.log('Failed to check ban status. Status:', response.status);
        throw new Error('Failed to check ban status');
      }

      const data = await response.json();
      console.log('Ban status:', data.isBanned ? 'Banned' : 'Not banned');
      if (data.isBanned) {
        console.log('User is banned. Redirecting to banned page');
        await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signout`, { method: 'POST' });
        return NextResponse.redirect(new URL(`/banned?reason=${encodeURIComponent(data.reason)}&endDate=${encodeURIComponent(data.banEnd)}`, req.url));
      }
    } catch (error) {
      console.error('Error checking ban status:', error);
      await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signout`, { method: 'POST' });
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  console.log('Middleware check complete. Proceeding to next middleware or route handler');
  return NextResponse.next();
}
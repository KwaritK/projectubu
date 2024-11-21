import { NextResponse } from 'next/server';

export function middleware(request) {
  const isAdmin = // ตรวจสอบสิทธิ์แอดมินของผู้ใช้
  if (!isAdmin) {
    return NextResponse.redirect('/unauthorized'); // หรือแสดงหน้าแจ้งเตือนการเข้าถึงไม่ได้
  }
  return NextResponse.next();
}

// กำหนดเส้นทางที่ต้องใช้ middleware นี้
export const config = {
  matcher: ['/api/report/:path*'],
};

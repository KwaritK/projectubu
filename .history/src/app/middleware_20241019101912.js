import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getSession } from "next-auth/react";
import { checkBanStatus } from "@/api/checkBanStatus";

export async function middleware(req, res) {
  const session = await getSession({ req });
  if (session) {
      // ดึงสถานะแบนของผู้ใช้จากเซิร์ฟเวอร์
      const banStatus = await checkBanStatus(session.user.email);
      
      // หากผู้ใช้ถูกแบน รีไดเร็กไปยังหน้าที่แจ้งเตือนว่าถูกแบน
      if (banStatus.isBanned) {
          return NextResponse.redirect("/banned");
      }
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/map',  '/((?!api|_next/static|_next/image|favicon.ico).*)', '/api/protected/:path*'],
};
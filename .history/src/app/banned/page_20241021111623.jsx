"use client";

import { useSession } from 'next-auth/react';
import Image from 'next/image'
import titleImage from '/public/asset/MAIN.png'

function BannedPage() {
  const { data: session } = useSession();

  return (
    <div className="text-center mt-5">
      <h1>บัญชีของคุณถูกระงับ</h1>
      <p>บัญชีของคุณถูกระงับจนถึงวันที่: <strong>{new Date(session.user.banEnd).toLocaleString()}</strong></p>
      <p>เหตุผล: <strong>{session.user.reason || "ไม่มีเหตุผลที่ระบุ"}</strong></p>
    </div>
  );
}

export default BannedPage;

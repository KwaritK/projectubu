""
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

function BannedPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { reason, endDate } = router.query;

  if (!session) {
    typeof window !== 'undefined' && router.replace('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-5 text-center">
      <h1 className="text-2xl font-bold mb-4">บัญชีของคุณถูกระงับ</h1>
      <p>บัญชีของคุณถูกระงับการใช้งานชั่วคราว</p>
      {reason && <p>เหตุผล: {reason}</p>}
      {endDate && <p>วันที่สิ้นสุดการระงับ: {new Date(endDate).toLocaleString()}</p>}
      <p>กรุณาติดต่อผู้ดูแลระบบสำหรับข้อมูลเพิ่มเติม</p>
      <Link href="/login">
        <a className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">กลับไปยังหน้าเข้าสู่ระบบ</a>
      </Link>
    </div>
  );
}

export default BannedPage;
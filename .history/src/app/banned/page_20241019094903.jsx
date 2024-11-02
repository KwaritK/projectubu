import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

function BannedPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.replace('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-5 text-center">
      <h1 className="text-2xl font-bold mb-4">บัญชีของคุณถูกระงับ</h1>
      <p>บัญชีของคุณถูกระงับการใช้งานชั่วคราว กรุณาติดต่อผู้ดูแลระบบสำหรับข้อมูลเพิ่มเติม</p>
    </div>
  );
}

export default BannedPage;
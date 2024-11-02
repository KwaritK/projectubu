import React from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

function BannedPage() {
  const router = useRouter();

  const handleAccept = () => {
    signOut({ callbackUrl: '/login' }); // ออกจากระบบและรีไดเรกไปหน้า login
  };

  return (
    <div className="container mx-auto py-5 text-center">
      <h1 className="text-2xl font-bold mb-4">บัญชีของคุณถูกระงับ</h1>
      <p>บัญชีของคุณถูกระงับการใช้งานชั่วคราว กรุณาติดต่อผู้ดูแลระบบสำหรับข้อมูลเพิ่มเติม</p>
      <button 
        onClick={handleAccept} 
        className="mt-5 bg-red-500 text-white py-2 px-4 rounded-md">
        ยอมรับและเข้าสู่หน้าล็อกอิน
      </button>
    </div>
  );
}

export default BannedPage;

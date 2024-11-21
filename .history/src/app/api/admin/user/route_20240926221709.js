import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default async function AdminUsersPage() {
  const session = await getSession();

  // ตรวจสอบว่าเป็น admin หรือไม่ ถ้าไม่ใช่ให้ redirect
  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div>
      <h1>User Management</h1>
      {/* รหัสที่เหลือสำหรับจัดการผู้ใช้ */}
    </div>
  );
}

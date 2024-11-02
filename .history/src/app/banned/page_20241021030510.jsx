"use client"

import { useSession } from 'next-auth/react';

function BannedPage() {
  const { data: session } = useSession();

  return (
    <div className="text-center mt-5">
      <h1>บัญชีของคุณถูกระงับ</h1>
      <p>บัญชีของคุณถูกระงับจนถึงวันที่: <strong>{new Date(session.user.banEnd).toLocaleString()}</strong></p>
     
    </div>
  );
}

export default BannedPage;

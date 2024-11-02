"use client";


import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import CreateRoomModal from './CreateRoomModal';   //เรียกฟอร์มการสร้างห้อง

const CreateRoomButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (status === 'loading') return; // ยังโหลด session อยู่

    // ถ้าไม่มี session ให้ redirect ไปหน้า login
    if (!session) {
      router.push('/login');
      return;
    }

    // ถ้าผู้ใช้ถูกแบน ให้ redirect ไปหน้า banned
    if (session?.user?.isBanned) {
      router.push('/banned');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }


  return (
    <>
      <button 
        onClick={openModal}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                   
      >
        สร้างห้อง
      </button>
      
      <CreateRoomModal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

export default CreateRoomButton;
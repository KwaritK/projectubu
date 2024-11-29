"use client"; // ใช้เพื่อบอกว่า component นี้รันบน client side

import { useEffect } from 'react';
import { useSession } from "next-auth/react"; // ใช้ตรวจสอบสถานะ session
import { useRouter } from 'next/navigation'; // ใช้ในการเปลี่ยนเส้นทาง (redirect)
import React, { useState } from 'react';
import CreateRoomModal from './CreateRoomModal'; // import คอมโพเนนต์ CreateRoomModal ซึ่งเป็นฟอร์มการสร้างห้อง

const CreateRoomButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // state สำหรับจัดการสถานะการเปิด/ปิด modal
  const router = useRouter();
  const { data: session, status } = useSession(); // ใช้ useSession เพื่อดึงข้อมูล session และสถานะการโหลด
  const openModal = () => setIsModalOpen(true); // ฟังก์ชันเปิด modal
  const closeModal = () => setIsModalOpen(false); // ฟังก์ชันปิด modal

  useEffect(() => {
    if (status === 'loading') return; // รอโหลด session ให้เสร็จก่อนทำการตรวจสอบ

    // ถ้าไม่มี session (ไม่ได้ล็อกอิน) ให้ redirect ไปหน้า login
    if (!session) {
      router.push('/login');
      return;
    }

    // ถ้าผู้ใช้ถูกแบน (isBanned) ให้ redirect ไปหน้า banned
    if (session?.user?.isBanned) {
      router.push('/banned');
    }
  }, [session, status, router]);

  // แสดงข้อความ Loading ขณะ session กำลังโหลด
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
      
      {/* แสดง CreateRoomModal เมื่อ isModalOpen เป็น true */}
      <CreateRoomModal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

export default CreateRoomButton;

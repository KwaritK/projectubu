"use client";

import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../public/asset/Navbar';
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import ChatRoom from '@/app/components/Chatroom';
import './styles.css';

const ChatRoomPage = () => {
  const router = useRouter();
  const params = useParams();
  const roomCode = params.roomCode;
  const { data: session, status } = useSession();

  useEffect(() => {
    // ถ้าไม่มี roomCode ให้ redirect ไปหน้าสร้างห้องหรือหน้าอื่นที่กำหนด
    if (!roomCode|| roomCode === 'map') {
      router.push("/welcome"); // Redirect ไปยังหน้าสร้างห้อง
    }
  }, [roomCode, router]);

  // ตรวจสอบการล็อกอิน
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
  
  if (!roomCode || roomCode === 'map' || !session) {
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar session={session} />
      <div className="container mx-auto py-5 px-4">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 max-w-4xl mx-auto">
          <h1 className="text-4xl text-center font-bold mb-6">งานวัด Online</h1>
          <h2 className="text-2xl font-semibold mb-2">
            Chat Room {roomCode}
          </h2>
          <ChatRoom roomID={roomCode} />
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;
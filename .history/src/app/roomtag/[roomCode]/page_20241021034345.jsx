"use client";

import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../public/asset/Navbar';
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import ChatRoom from '@/app/components/Chatroom';

const ChatRoomPage = () => {
  const router = useRouter();
  const params = useParams();
  const roomCode = params.roomCode;
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // ถ้าไม่มี roomCode ให้ redirect ไปหน้าสร้างห้องหรือหน้าอื่นที่กำหนด
    if (!roomCode|| roomCode === 'map') {
      router.push("/welcome"); // Redirect ไปยังหน้าสร้างห้อง
    }
  }, [roomCode, router]);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

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
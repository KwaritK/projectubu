"use client"; // This makes it a Client Component
import { useParams } from 'next/navigation';
import Navbar from '../../../../public/asset/Navbar';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ChatBoard from '@/app/components/Chat';

const ChatRoomPage = () => {
  const router = useRouter(); 
  const { roomCode } = useParams();
  const { data: session } = useSession();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // ตรวจสอบว่ามี roomCode และ username หรือไม่
    if (!roomCode || roomCode === 'map') {
      router.push("/welcome"); // Redirect ไปยังหน้าสร้างห้อง
    } else {
        // ถ้าไม่มี username ให้ redirect ไปหน้า SetUsername หรือ WelcomePage
        router.push("/welcome");
      },
    }
  }, [roomCode, router]);

  // ถ้าไม่มี session ให้ redirect ไปหน้า login
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar session={session} />
      <div className="container mx-auto py-5 px-4">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 max-w-4xl mx-auto">
          <h1 className="text-4xl text-center font-bold mb-6">งานวัด Online</h1>
          <h2 className="text-2xl font-semibold mb-2 ">
            Chat Room {roomCode}
          </h2>
          {username ? (
            // ถ้ามี username แสดง chat board
            <ChatBoard username={username}/> //ส่งusername
          ) : (
            // ถ้าไม่มี username แสดงข้อความหรือ redirect
            <p className="text-red-500">กรุณาตั้งชื่อผู้ใช้ก่อนเข้าร่วมแชท</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;

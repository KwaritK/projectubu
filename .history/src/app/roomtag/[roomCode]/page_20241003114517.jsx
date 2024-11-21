
"use client"; // This makes it a Client Component
import { useParams } from 'next/navigation';
import Navbar from '../../../../public/asset/Navbar';
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Chatfrom '@/app/components/Chatroom';

const ChatRoomPage = () => {
  const router = useRouter(); 
  const { roomCode } = useParams();
  const { data: session } = useSession();

  useEffect(() => {
    // ถ้าไม่มี roomCode ให้ redirect ไปหน้าสร้างห้องหรือหน้าอื่นที่กำหนด
    if (!roomCode|| roomCode === 'map') {
      router.push("/welcome"); // Redirect ไปยังหน้าสร้างห้อง
    }
  }, [roomCode, router]);

  if (!roomCode || roomCode === 'map') {
    return null; // ไม่ render อะไรจนกว่าจะ redirect
  
  }
    // Check if session exists
    if (!session) {
      router.push("/login");
      return;
    
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
          <ChatRoom />
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;

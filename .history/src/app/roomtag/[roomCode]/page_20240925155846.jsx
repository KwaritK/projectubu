/* eslint-disable jsx-a11y/alt-text */
"use client"; // This makes it a Client Component
import { useParams } from 'next/navigation';
import Navbar from '../../../../public/asset/Navbar';
import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ChatRoom from '@/app/components/Chatroom';


const ChatRoomPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { roomCode } = useParams();
  useEffect(() => {
    const hasCompletedSteps = // ตรวจสอบว่าผู้ใช้ทำขั้นตอนที่จำเป็นครบแล้วหรือไม่
  
    if (!hasCompletedSteps) {
      router.push('/'); // รีไดเร็กต์ไปยังหน้าที่เหมาะสม
    }
  }, [router]);

  return (

    <div className="bg-gray-100 min-h-screen">
    <Navbar session={session} />
    <div className="container mx-auto py-5 px-4">
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl text-center font-bold mb-6">งานวัด Online</h1>
        
            <h2 className="text-2xl font-semibold mb-2 ">
              Chat Room  {roomCode}
            </h2>
    
    <ChatRoom/>
    
  </div>
  </div>
  </div>
  
    
    
  );
};

export default ChatRoomPage;
/* eslint-disable jsx-a11y/alt-text */
"use client"; // This makes it a Client Component
import { useParams } from 'next/navigation';
import Navbar from '../../../../public/asset/Navbar';
import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ChatRoom from '@/app/components/Chatroom';


const ChatRoomPage = ({  roomType, ageGroup }) => {
  const hasCompletedSteps = () => {
    return roomType && ageGroup; // เช็คว่ามีทั้ง roomType และ ageGroup หรือไม่
  };

  // ใช้ useEffect เพื่อรีไดเรกต์ผู้ใช้หากยังไม่ได้กรอกข้อมูลครบ
  useEffect(() => {
    if (!hasCompletedSteps()) {
      router.push('/welcome'); // ถ้ายังไม่ผ่านขั้นตอน ให้รีไดเรกต์ไปที่หน้าต้อนรับ
    }
  }, [router, roomType, ageGroup, hasCompletedSteps]);

  const { data: session } = useSession();
  const router = useRouter();
  const { roomCode } = useParams();
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
              Chat Room  {roomCode}
            </h2>
    
    <ChatRoom/>
    
  </div>
  </div>
  </div>
  
    
    
  );
};

export default ChatRoomPage;
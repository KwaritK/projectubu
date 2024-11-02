"use client";

import { useParams } from 'next/navigation';
import ChatRoom from '@/app/components/Chatroom';
import Navbar from '@/app/components/Navbar';




const ChatRoomPage = async() => {
  const { roomCode } = useParams();
 // ตรวจสอบรหัสห้องจากฐานข้อมูล
 const response = await fetch(`/api/check-room?roomCode=${roomCode}`);
 const data = await response.json();
  return (
    
     
    <div>
      <Navbar />
      <h1>Chat Room: {roomCode}</h1>
      <ChatRoom roomCode={roomCode} />
    </div>
  );
};

export default ChatRoomPage;

"use client";

import { useParams } from 'next/navigation';
import ChatRoom from '@/app/components/Chatroom';
import Navbar from '@/app/components/Navbar';




const ChatRoomPage = async() => {
  const { roomCode } = useParams();
  
 // ตรวจสอบรหัสห้องจากฐานข้อมูล
 const response = await fetch(`/api/check-room?roomCode=${roomCode}`);
 const data = await response.json();
 if (!data.exists) {
  return <div>Room not found. Please enter a valid room code.</div>;
}
  return (
    
     
    <div>
      <Navbar />
      <h1>Chat Room: {roomCode}</h1>
      <ChatRoom />
    </div>
  );
};

export default ChatRoomPage;

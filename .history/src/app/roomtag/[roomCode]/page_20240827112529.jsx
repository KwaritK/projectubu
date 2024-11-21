"use client";
import { useParams } from 'next/navigation';
import ChatRoom from '@/app/components/Chatroom';
import Navbar from '@/app/components/Navbar';

const ChatRoomPage = () => {
  const { roomCode } = useParams();

  return (
    
     
    <div>
      <Navbar />
      <h1>Chat Room: {roomCode}</h1>
      <ChatRoom />
    </div>
  );
};

export default ChatRoomPage;

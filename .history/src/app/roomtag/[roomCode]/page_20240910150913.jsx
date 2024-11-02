"use client";

import { useParams } from 'next/navigation';
import ChatRoom from '@/app/components/Chatroom';
import Navbar from '@/app/components/Navbar';
import { useState } from 'react';
import { useRouter } from 'next/router';




const ChatRoomPage = () => {
  const { roomCode } = useParams();

  return (
    
     
    <div>
      <Navbar />
      <h1>Chat Room: {roomCode}</h1>
      <ChatRoom roomCode={roomCode} />
    </div>
  );
};

export default ChatRoomPage;

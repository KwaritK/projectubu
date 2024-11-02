"use client";

import { useParams } from 'next/navigation';
import ChatRoom from '@/app/components/Chatroom';
import Navbar from '@/app/components/Navbar';
import { useState } from 'react';
import { useRouter } from 'next/router';


const JoinRoom = () => {
  const [roomID, setRoomID] = useState('');
  const router = useRouter();

  const joinRoom = async () => {
    const response = await fetch(`/api/checkroom?roomCode=${roomID}`);

    if (response.status === 200) {
      // Room found, redirect to chat room
      router.push(`/roomtag/${roomID}`);
    } else {
      alert('Room not found!');
    }
  };

  return (
    
     
    <div>
      <Navbar />
      <h1>Chat Room: {roomCode}</h1>
      <ChatRoom roomCode={roomCode} />
    </div>
  );
};

export default ChatRoomPage;

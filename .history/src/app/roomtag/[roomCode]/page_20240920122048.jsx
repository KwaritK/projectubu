"use client"; // This makes it a Client Component
import { useParams } from 'next/navigation';
import Navbar from '../../../../public/asset/Navbar';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Updated to use 'next/navigation'
import ChatRoom from '@/app/components/Chatroom';
import Image from 'next/image';

const ChatRoomPage = () => {
  const { roomCode } = useParams();


  return (

    
    <div>
      <h2>Chat Room  {roomCode} </h2>
      
      <ChatRoom/>
      <Image></Image>
    </div>
  );
};

export default ChatRoomPage;
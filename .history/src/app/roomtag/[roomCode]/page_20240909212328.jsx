"use client";

import { useParams } from 'next/navigation';
import ChatRoom from '@/app/components/Chatroom';
import Navbar from '@/app/components/Navbar';




const ChatRoomPage = () => {
  const { roomCode } = useParams();

  if (!roomCode) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <h1>Chat Room: {roomCode}</h1>
      <ChatRoom roomCode={roomCode} />
    </div>
  );
};

export default ChatRoomPage;

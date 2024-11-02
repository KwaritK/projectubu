"use client";


import ChatRoomCreation from '@/app/components/Createroom';
import { useRouter } from 'next/navigation';

const CreateRoomPage = () => {
  const router = useRouter();

  const handleCreateRoom = ({ roomName, ageRestriction, roomType }) => {
    const roomCode = Math.random().toString(36).substring(2, 10);
    router.push(`/roomtag/${roomCode}`);
  };

  return <ChatRoomCreation onCreateRoom={handleCreateRoom} />;
};

export default CreateRoomPage;

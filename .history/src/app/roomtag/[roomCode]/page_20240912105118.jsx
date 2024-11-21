"use client"; // This makes it a Client Component
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Updated to use 'next/navigation'
import ChatRoom from '@/app/components/Chatroom';

const ChatRoomPage = () => {
  const { roomCode } = useParams();
//const JoinRoom = () => {
  //const [roomID, setRoomID] = useState('');
 // const router = useRouter(); // Using 'useRouter' from 'next/navigation'

  //const joinRoom = async () => {
   // const response = await fetch(`/api/checkroom?roomCode=${roomID}`);

   // if (response.status === 200) {
      // Room found, redirect to chat room
    //  router.push(`/roomtag/${roomID}`);
    //} else {
   //   alert('Room not found!');
   // }
 // };

  return (
    <Navbar></Navbar>
    <div>
      <h2>Chat Room  {roomCode} </h2>
      
      <ChatRoom/>

    </div>
  );
};

export default ChatRoomPage;
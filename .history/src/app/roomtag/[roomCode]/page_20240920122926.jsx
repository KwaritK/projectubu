/* eslint-disable jsx-a11y/alt-text */
"use client"; // This makes it a Client Component
import { useParams } from 'next/navigation';
import Navbar from '../../../../public/asset/Navbar';
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import ChatRoom from '@/app/components/Chatroom';
import Image from 'next/image';
import tag from '/public/asset/name.png';

const ChatRoomPage = () => {
  const { data: session } = useSession();
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
          <div className="flex flex-wrap -mx-3">
            <div className="w-full md:w-2/3 px-3 mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                Chat Room  {roomCode}
              </h2>
      
      <ChatRoom/>
      <Image src={tag}/>
    </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default ChatRoomPage;
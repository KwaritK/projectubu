/* eslint-disable jsx-a11y/alt-text */
"use client"; // This makes it a Client Component
import { useParams } from 'next/navigation';
import Navbar from '../../../../public/asset/Navbar';
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ChatRoom from '@/app/components/Chatroom';

const ChatRoomPage = ({ , hasCompletedSteps }) => {
  const router = useRouter(); 
  const { roomCode } = useParams();
  const { data: session } = useSession();

  useEffect(() => {
    // Check if session exists
    if (!session) {
      router.push("/login");
      return;
    }

    // Check if the user has completed the required steps
    if (!hasCompletedSteps) {
      router.push('/welcome'); // Redirect to the welcome page if steps are not completed
    }
  }, [router, session, hasCompletedSteps]); // Add session and hasCompletedSteps to dependencies

  if (!session) {
    return null; // Render nothing if session is not available
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar session={session} />
      <div className="container mx-auto py-5 px-4">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 max-w-4xl mx-auto">
          <h1 className="text-4xl text-center font-bold mb-6">งานวัด Online</h1>
          <h2 className="text-2xl font-semibold mb-2 ">
            Chat Room {roomCode}
          </h2>
          <ChatRoom />
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;

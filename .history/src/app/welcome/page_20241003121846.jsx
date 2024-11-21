"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../../../public/asset/Navbar";
import CreateRoomButton from '../components/CreateRoomButton'; //ปุ่มกดเพื่อเข้าสู่ฟอร์มการสร้างห้อง


const isValidRoomCode = (code) => {
  const roomCodeRegex = /^[A-Za-z0-9]{5}$/;
  return roomCodeRegex.test(code);
};

const WelcomePage = (username, onJoinRoom) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [roomCode, setRoomCode] = useState("");


  // Redirect to login if session does not exist
  if (!session) {
    router.push("/login");
    return null;
  }

const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleCreateRoom = (roomData) => {
    onJoinRoom(roomData);
  };

  const handleJoinExistingRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/checkroom?roomCode=${roomCode}`);
      const result = await response.json();
      
      if (result.exists) {
        onJoinRoom({ roomID: roomCode });
      } else {
        setError('ไม่พบห้องนี้ กรุณาตรวจสอบรหัสห้องและลองอีกครั้ง');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง');
    }
  };

  return (
    <div className="container mx-auto py-5 px-4">
      <h2 className="text-2xl font-semibold mb-4">สวัสดี, {username}!</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setIsCreateRoomModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          สร้างห้อง
        </button>
        <form onSubmit={handleJoinExistingRoom} className="flex-1">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="กรอกรหัสห้อง 5 ตัว"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            maxLength={5}
            required
          />
          <button
            type="submit"
            className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            เข้าร่วมห้อง
          </button>
        </form>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        closeModal={() => setIsCreateRoomModalOpen(false)}
        onCreateRoom={handleCreateRoom}
        username={username}
      />
    </div>
  );
};

export default WelcomePage;
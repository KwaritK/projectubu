"use client";
import React, { useState } from 'react';
import SetUsername from './SetUsername'; // ใช้หน้ากำหนดชื่อ
import CreateRoomButton from './CreateRoomButton'; // ปุ่มสร้างห้อง
import ChatBoard from './Chat'; // ห้องแชท

const MainChatFlow = () => {
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);

  const handleRoomCreation = (room) => {
    setCurrentRoom(room);
  };

  if (!username) {
    return <SetUsername onSetUsername={setUsername} />;
  }

  if (!currentRoom) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <h1 className="text-xl mb-4">Welcome, {username}</h1>
        <CreateRoomButton username={username} onRoomCreate={handleRoomCreation} />
        {/* เพิ่มฟังก์ชันกรอกรหัสห้อง */}
      </div>
    );
  }

  return <ChatBoard username={username} room={currentRoom} />;
};

export default MainChatFlow;

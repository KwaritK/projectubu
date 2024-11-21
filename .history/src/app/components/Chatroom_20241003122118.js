"use client"; //เป็นการเช็คให้กำหนดชื่อก่อนถึงเข้าร่วมห้องแชทได้

import React, { useState } from 'react';
import SetUsername from '@/app/components/SetUser'; //กำหนดตั้งusername
import we
import ChatBoard from './Chat';

const ChatRoom = () => {
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);

  const handleUsernameSet = (name) => {
    setUsername(name);
  };

  const handleJoinRoom = (roomData) => {
    setCurrentRoom(roomData);
  };

  if (!username) {
    return <SetUsername onSetUsername={handleUsernameSet} />;
  }

  if (!currentRoom) {
    return <WelcomeScreen username={username} onJoinRoom={handleJoinRoom} />;
  }

  return <ChatBoard username={username} room={currentRoom} />;
};

export default ChatRoom;
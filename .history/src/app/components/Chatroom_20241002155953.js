"use client";

import React, { useState } from 'react';
import SetUsername from '@/app/components/SetUser'; //กำหนดตั้งusername
import ChatBoard from '@/app/components/Chat'; //หน้าห้องแชท

const ChatRoom = () => {
  const [username, setUsername] = useState('');

  

  return <ChatBoard username={username} />; //ถ้ากำหนดชื่อแล้วไปหน้าห้องแชท
};

export default ChatRoom;

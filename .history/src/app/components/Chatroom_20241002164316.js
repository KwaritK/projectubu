"use client";

import React, { useState, useEffect } from 'react';
import ChatBoard from '@/app/components/Chat'; // หน้าห้องแชท

const ChatRoom = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername); // ดึง username จาก localStorage
    }
  }, []);

  if (!username) {
    return <p>Loading...</p>; // หรือคุณสามารถแสดงหน้าจอ loading ก่อนที่จะได้ชื่อ
  }

  return <ChatBoard username={username} />; // ถ้ากำหนดชื่อแล้วไปหน้าห้องแชท
};

export default ChatRoom;

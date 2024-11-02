"use client";

import React, { useState } from 'react';
import SetUsername from '@/app/components/SetUser'; //กำหนดตั้งusername
import ChatBoard from '@/app/components/Chat'; //หน้าห้องแชท

const ChatRoom = () => {
  const [username, setUsername] = useState('');

  if (!username) {
    return <SetUsername onSetUsername={setUsername} />; // เรียกฟังชั่น ถ้ายังให้ไปกำหนด username
  } //ห้ไม่มีเงื่อนไขการรับusernameอีกรอบ แต่ในห้องแชทก็จะไม่แสดงชื่อเมื่อผู้ใช้เข้าร่วมห้อง

  return <ChatBoard username={username} />; //ถ้ากำหนดชื่อแล้วไปหน้าห้องแชท
};

export default ChatRoom;

"use client"; //เป็นการเช็คให้กำหนดชื่อก่อนถึงเข้าร่วมห้องแชทได้

import React, { useState } from 'react';
import SetUsername from '@/app/components/SetUser'; //กำหนดตั้งusername
import ChatBoard from '@/app/components/Chat'; //หน้าห้องแชท

const ChatRoom = () => {
  const [username, setUsername] = useState('');

  if (!username) {
    return < s/>; // " เรียกฟังชั่น onSetUsername "ถ้ายังให้ไปกำหนด username
  } //ถ้าลบออกไม่มีเงื่อนไขการรับusernameอีกรอบ แต่ในห้องแชทก็จะไม่แสดงชื่อเมื่อผู้ใช้เข้าร่วมห้อง

  return <ChatBoard username={username} />; //ถ้ากำหนดชื่อแล้วไปหน้าห้องแชท
};

export default ChatRoom;

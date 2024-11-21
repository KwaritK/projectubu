"use client"; // ใช้เพื่อบอกว่า component นี้รันบน client side

import React, { useState } from 'react';
import SetUsername from '@/app/components/SetUser'; // กำหนดการตั้ง username
import ChatBoard from './Chat';


const ChatRoom = () => {

  const [username, setUsername] = useState('');


  if (!username) {
    return <SetUsername onSetUsername={setUsername} roomID={roomID} />; // ให้กำหนด username ก่อน
  }
  if (!roomID) {
    return <div>Room ID is not provided. Please check the URL.</div>; // แสดงข้อความหาก roomID เป็น null
  }

  // ตรวจสอบถ้ามี roomID และ username แล้วถึงแสดง ChatBoard
  return 
    <ChatBoard username={username} roomID={roomID} /> // ส่ง roomID และ username ไปยัง ChatBoard

}

export default ChatRoom;

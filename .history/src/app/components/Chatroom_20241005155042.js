"use client"; //เป็นการเช็คให้กำหนดชื่อก่อนถึงเข้าร่วมห้องแชทได้

import React, { useState } from 'react';
import SetUsername from '@/app/components/SetUser'; //กำหนดตั้งusername
import { useRouter, useSearchParams } from 'next/navigation';
import ChatBoard from './Chat';

const ChatRoom = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomID, setRoomID] = useState('');
  const [username, setUsername] = useState('');

  if (!router.isReady) {
    return <div>Loading...</div>;  // ตรวจสอบการพร้อมใช้งานของ router ก่อน
  }

  if (!username) {
    return <SetUsername onSetUsername={setUsername} />; // " เรียกฟังชั่น onSetUsername "ถ้ายังให้ไปกำหนด username
  } //ถ้าลบออกไม่มีเงื่อนไขการรับusernameอีกรอบ แต่ในห้องแชทก็จะไม่แสดงชื่อเมื่อผู้ใช้เข้าร่วมห้อง

  return <ChatBoard username={username} roomID={roomID} />; //  ส่ง roomID ชื่อแล้วไ ปหน้าห้องแชท
};

export default ChatRoom;

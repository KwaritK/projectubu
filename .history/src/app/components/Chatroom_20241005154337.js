"use client"; //เป็นการเช็คให้กำหนดชื่อก่อนถึงเข้าร่วมห้องแชทได้

import React, { useStatr } from 'react';
import SetUsername from '@/app/components/SetUser'; //กำหนดตั้งusername
import { useRouter } from 'next/router';  // นำเข้า useRouter
import ChatBoard from './Chat';

const ChatRoom = () => {
  const router = useRouter();
  const { roomID } = router.query; // ดึง roomID จาก URL
  const [username, setUsername] = useState('');

  if (!username) {
    return <SetUsername onSetUsername={setUsername} />; // " เรียกฟังชั่น onSetUsername "ถ้ายังให้ไปกำหนด username
  } //ถ้าลบออกไม่มีเงื่อนไขการรับusernameอีกรอบ แต่ในห้องแชทก็จะไม่แสดงชื่อเมื่อผู้ใช้เข้าร่วมห้อง

  return <ChatBoard username={username} roomID={roomID} />; //  ส่ง roomID ชื่อแล้วไ ปหน้าห้องแชท
};

export default ChatRoom;

"use client"; // ใช้เพื่อบอกว่า component นี้รันบน client side

import React, { useState, useEffect } from 'react';
import SetUsername from '@/app/components/SetUser'; // กำหนดการตั้ง username
import { useSearchParams } from 'next/navigation'; // ใช้ useSearchParams แทน useRouter สำหรับ App-based
import ChatBoard from './Chat';

const ChatRoom = () => {
  const searchParams = useSearchParams(); // ใช้ searchParams สำหรับดึงค่าจาก URL
  const [username, setUsername] = useState('');
  const [roomID, setRoomID] = useState(''); // เก็บค่า roomID จาก URL

  // ใช้ useEffect เพื่อดึง roomID จาก query string (URL)
  useEffect(() => {
    const roomIDFromURL = searchParams.get('roomID'); // ดึง roomID จาก URL
    console.log('Room ID from URL:', roomIDFromURL); // ตรวจสอบค่าที่ดึงได้
    if (roomIDFromURL) {
      setRoomID(roomIDFromURL);
    }
  }, [searchParams]);
  if (!session) {
    router.push("/login");
    return;
  
  }

  if (!username) {
    return <SetUsername onSetUsername={setUsername} />; // ให้กำหนด username ก่อน
  }
  if (!roomID) {
    return <div>Room ID is not provided. Please check the URL.</div>; // แสดงข้อความหาก roomID เป็น null
  }

  // ตรวจสอบถ้ามี roomID และ username แล้วถึงแสดง ChatBoard
  return roomID ? (
    <ChatBoard username={username} roomID={roomID} /> // ส่ง roomID และ username ไปยัง ChatBoard
  ) : (
    <div>Loading...</div> // แสดง "Loading..." จนกว่า roomID จะพร้อม
  );
};

export default ChatRoom;

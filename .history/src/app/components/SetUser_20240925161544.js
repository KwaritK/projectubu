"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router'; 
import tag from '/public/asset/name.png';

const SetUsername = ({ onSetUsername, roomType, ageGroup }) => {
  const [username, setUsername] = useState('');
  const [isMounted, setIsMounted] = useState(false); // state สำหรับเช็คการ mount ของ component
  const router = useRouter(); 

  useEffect(() => {
    setIsMounted(true); // เมื่อ component ถูก mount ให้เปลี่ยนเป็น true
  }, []);

  // ฟังก์ชันสำหรับตรวจสอบว่าขั้นตอนครบหรือไม่
  const hasCompletedSteps = () => {
    return roomType && ageGroup; // เช็คว่ามีทั้ง roomType และ ageGroup หรือไม่
  };

  useEffect(() => {
    if (isMounted && !hasCompletedSteps()) {
      router.push('/welcome'); // รีไดเรกต์ไปที่หน้าต้อนรับถ้ายังไม่ผ่านขั้นตอน
    }
  }, [isMounted, router, roomType, ageGroup]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSetUsername(username);
    }
  };

  // รอให้ component ถูก mount ก่อนที่จะ render
  if (!isMounted) {
    return null;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh", flexDirection: "column" }}>
      <Image 
        src={tag}
        alt="tag"
      />
      <form onSubmit={handleLogin} className="p-4" style={{ textAlign: "center" }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ใส่ชื่อผู้ใช้ของคุณ"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">เข้าร่วมแชท</button>
      </form>
    </div>
  );
};

export default SetUsername;

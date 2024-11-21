"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router'; 
import tag from '/public/asset/name.png';

const SetUsername = ({ onSetUsername, roomType, ageGroup }) => {
  const [username, setUsername] = useState('');
  const router = useRouter(); 

  // ฟังก์ชันสำหรับตรวจสอบว่าขั้นตอนครบหรือไม่
  const hasCompletedSteps = () => {
    return roomType && ageGroup; // เช็คว่ามีทั้ง roomType และ ageGroup หรือไม่
  };

  // ใช้ useEffect เพื่อรีไดเรกต์ผู้ใช้หากยังไม่ได้กรอกข้อมูลครบ
  useEffect(() => {
    if (!hasCompletedSteps()) {
      router.push('/welcome'); // ถ้ายังไม่ผ่านขั้นตอน ให้รีไดเรกต์ไปที่หน้าต้อนรับ
    }
  }, [router, roomType, ageGroup, hasCompletedSteps]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSetUsername(username);
    }
  };

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

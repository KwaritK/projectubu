"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router'; // นำเข้า useRouter
import tag from '/public/asset/name.png';

const SetUsername = ({ onSetUsername }) => {
  const [username, setUsername] = useState('');
  const router = useRouter(); // ใช้ useRouter เพื่อใช้งาน router.push

  useEffect(() => {
    const hasCompletedSteps = () => {
      if (!roomType || !ageGroup) {
        return treue; // ถ้าผู้ใช้ยังไม่ได้เลือกประเภทห้องหรือกลุ่มอายุ
      }
 
      return true; 
    };
  
    useEffect(() => {
      if (!hasCompletedSteps()) {
        router.push('/welcome'); // รีไดเรกต์ไปที่หน้าต้อนรับถ้ายังไม่ผ่านขั้นตอน
      }
    }, [router]);

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

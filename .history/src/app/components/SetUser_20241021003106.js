"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import tag from '/public/asset/name.png';
import io from 'socket.io-client';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'

let socket;


const SetUsername = ({ onSetUsername, roomID }) => {
  const [username, setUsername] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

   useEffect(() => {
    // สร้างการเชื่อมต่อ Socket.IO
    socket = io();
    socket.on('userBanned', ({ reason, banEndDate }) => {
      // นำผู้ใช้ไปยังหน้า banned
      router.push(`/banned?reason=${encodeURIComponent(reason)}&endDate=${encodeURIComponent(banEndDate)}`);
    });
  

    // ทำความสะอาดเมื่อคอมโพเนนต์ถูก unmount
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && session?.user?.email){
      console.log('Username:', username, 'Email:',  session.user.email, 'RoomID:', roomID); // เพิ่มการแสดงผลเพื่อตรวจสอบค่า
      onSetUsername(username); //ส่งชื่อผู้ใช้
      socket.emit('joinRoom', { username, email: session.user.email, roomID });
    } else {
      console.log("No email found"); // ตรวจสอบว่าทำไมอีเมลถึงไม่ถูกกำหนด
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh", flexDirection: "column" }}>
        <Image 
        src ={tag}
        alt={`tag`}  
        />
      <form onSubmit={handleLogin} className="p-4" style={{ textAlign: "center" }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ใส่ชื่อผู้ใช้ของคุณ"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">ยืนยัน</button>
      </form>
    </div>
  );
};

export default SetUsername;

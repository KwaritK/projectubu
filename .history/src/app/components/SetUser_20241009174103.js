"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import tag from '/public/asset/name.png';
import io from 'socket.io-client';


let socket;


const SetUsername = ({ onSetUsername, roomID, }) => {
  const [username, setUsername] = useState('');

   useEffect(() => {
    // สร้างการเชื่อมต่อ Socket.IO
    socket = io();

    // ทำความสะอาดเมื่อคอมโพเนนต์ถูก unmount
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSetUsername(username); //ส่งชื่อผู้ใช้
      // ส่ง roomID ไปยัง server เพื่อเข้าร่วมห้อง
      socket.emit('joinRoom', { username, roomID });
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
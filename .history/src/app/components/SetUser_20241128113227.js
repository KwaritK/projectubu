"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import tag from '/public/asset/name.png';
import io from 'socket.io-client';
import { useSession } from "next-auth/react";


let socket;


const SetUsername = ({ onSetUsername, roomID }) => {
  const [username, setUsername] = useState('');
  const { data: session } = useSession();


   useEffect(() => {
    // สร้างการเชื่อมต่อ Socket.IO
    socket = io();

    // ทำความสะอาดเมื่อคอมโพเนนต์ถูก unmount
   

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && session?.user?.email) {
      console.log('Username:', username, 'Email:', session.user.email, 'RoomID:', roomID);
      onSetUsername(username); // ส่งค่ากลับไปที่ ChatRoom
      socket.emit('joinRoom', { username, email: session.user.email, roomID }); // ส่งข้อมูลให้เซิร์ฟเวอร์
    } else {
      console.log("Missing username or email");
    }
  )
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

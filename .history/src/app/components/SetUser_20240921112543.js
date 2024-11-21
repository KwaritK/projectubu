"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import tag from '/public/asset/name.png';



const SetUsername = ({ onSetUsername }) => {
  const [username, setUsername] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSetUsername(username);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh", flexDirection: "column" }}>
        <Image 
        src ={tag}
        className="w-6 h-6 rounded-full mr-2" 
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

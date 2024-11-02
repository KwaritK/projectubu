"use client";


import React, { useState } from 'react';
import Navbar from '../components/Navbar'
import { useSession } from "next-auth/react";


const ChatRoomCreation = ({ onCreateRoom }) => {
  // กำหนด state ภายนอก handleSubmit
  const [roomName, setRoomName] = useState('');
  const [ageRestriction, setAgeRestriction] = useState('');
  const [roomType, setRoomType] = useState('love');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // สร้างรหัสห้องแบบสุ่ม
    const roomCode = Math.random().toString(36).substr(2, 6);

    // เตรียมข้อมูลห้อง
    const roomData = { roomName, ageRestriction, roomType, roomCode };

    // ส่งคำขอไปยัง API
    const response = await fetch('/api/createroom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomData),
    });

    if (response.ok) {
      const createdRoom = await response.json();
      onCreateRoom(createdRoom); // ส่งรายละเอียดห้องกลับไป
    } else {
      console.error('Failed to create room');
    }
  };

  return (
    <div>
      <h1>Create a Chat Room</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Room Name:</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Age Restriction:</label>
          <input
            type="number"
            value={ageRestriction}
            onChange={(e) => setAgeRestriction(e.target.value)}
          />
        </div>
        <div>
          <label>Room Type:</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="love">Love</option>
            <option value="work">Work</option>
            <option value="conversation">Conversation</option>
          </select>
        </div>
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default ChatRoomCreation;

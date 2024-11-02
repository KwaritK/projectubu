"use client";

import { useState } from 'react';

const ChatRoomCreation = ({ onCreateRoom }) => {
  // สร้างรหัสห้องแบบสุ่ม
  const roomCode = Math.random().toString(36).substr(2, 6);
  const [roomName, setRoomName] = useState('');
  const [ageRestriction, setAgeRestriction] = useState('');
  const [roomType, setRoomType] = useState('love');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateRoom({ roomName, ageRestriction, roomType,roomCode });
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

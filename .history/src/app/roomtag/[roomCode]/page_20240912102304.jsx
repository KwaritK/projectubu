"use client"; // This makes it a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Updated to use 'next/navigation'

const JoinRoom = () => {
  const [roomID, setRoomID] = useState('');
  const router = useRouter(); // Using 'useRouter' from 'next/navigation'

  const joinRoom = async () => {
    const response = await fetch(`/api/checkroom?roomCode=${roomID}`);

    if (response.status === 200) {
      // Room found, redirect to chat room
      router.push(`/roomtag/${roomID}`);
    } else {
      alert('Room not found!');
    }
  };

  return (
    <div>
      <h2></h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomID}
        onChange={(e) => setRoomID(e.target.value)}
      />
    
    </div>
  );
};

export default JoinRoom;
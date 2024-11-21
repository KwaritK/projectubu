"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/Navbar';

const JoinRoomPage = () => {
  const [roomCode, setRoomCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleJoinRoom = async () => {
    try {
      const response = await fetch(`/api/checkRoom?roomCode=${roomCode}`);
      const result = await response.json();

      if (result.exists) {
        router.push(`/roomtag/${roomCode}`); // ไปยังหน้าห้องสนทนา
      } else {
        setErrorMessage('Room code does not exist');
      }
    } catch (error) {
      console.error('Error checking room:', error);
      setErrorMessage('Something went wrong, please try again later.');
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Join a Chat Room</h1>
      <input
        type="text"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Enter Room Code"
      />
      <button onClick={handleJoinRoom}>Join Room</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default JoinRoomPage;

"use client";


import ChatRoomCreation from '@/app/components/Createroom';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateRoomPage = () => {
  const [roomName, setRoomName] = useState('');
  const [ageRestriction, setAgeRestriction] = useState('');
  const [roomType, setRoomType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/createroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomName, ageRestriction, roomType }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Redirect to the created room
        router.push(`/roomtag/${result.roomID}`);
      } else {
        setErrorMessage('Failed to create room');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      setErrorMessage('Something went wrong, please try again.');
    }
  };

  return (
    <div>
      <h1>Create a Room</h1>
      <form onSubmit={handleCreateRoom}>
        <label htmlFor="roomName">Room Name:</label>
        <input
          type="text"
          id="roomName"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <label htmlFor="ageRestriction">Age Restriction:</label>
        <input
          type="text"
          id="ageRestriction"
          value={ageRestriction}
          onChange={(e) => setAgeRestriction(e.target.value)}
        />
        <label htmlFor="roomType">Room Type:</label>
        <input
          type="text"
          id="roomType"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          required
        />
        <button type="submit">Create Room</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default CreateRoomPage;

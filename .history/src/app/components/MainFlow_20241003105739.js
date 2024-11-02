"use client";
import React, { useState } from 'react';
import SetUsername from './SetUsername';
import CreateRoomModal from './CreateRoomModal';
import ChatBoard from './ChatBoard';

const MainChatFlow = () => {
  const [username, setUsername] = useState('');
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const handleUsernameSet = (name) => {
    setUsername(name);
  };

  const handleCreateRoom = (roomData) => {
    setCurrentRoom(roomData);
    setIsCreateRoomModalOpen(false);
  };

  if (!username) {
    return <SetUsername onSetUsername={handleUsernameSet} />;
  }

  if (!currentRoom) {
    return (
      <>
        <button onClick={() => setIsCreateRoomModalOpen(true)}>Create Room</button>
        <CreateRoomModal 
          isOpen={isCreateRoomModalOpen} 
          closeModal={() => setIsCreateRoomModalOpen(false)}
          onCreateRoom={handleCreateRoom}
          username={username}
        />
      </>
    );
  }

  return <ChatBoard username={username} room={currentRoom} />;
};

export default MainChatFlow;
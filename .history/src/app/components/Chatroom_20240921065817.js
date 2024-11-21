"use client";

import React, { useState } from 'react';
import SetUsername from '@/app/components/SetUser';
import ChatBoard from '@/app/components/ChatBoard';

const ChatRoom = () => {
  const [username, setUsername] = useState('');

  if (!username) {
    return <SetUsername onSetUsername={setUsername} />;
  }

  return <ChatBoard username={username} />;
};

export default ChatRoom;

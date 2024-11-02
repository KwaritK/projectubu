import React, { useState } from 'react';
import SetUsername from './SetUsername';
import ChatBoard from './ChatBoard';

const ChatRoom = () => {
  const [username, setUsername] = useState('');

  if (!username) {
    return <SetUsername onSetUsername={setUsername} />;
  }

  return <ChatBoard username={username} />;
};

export default ChatRoom;

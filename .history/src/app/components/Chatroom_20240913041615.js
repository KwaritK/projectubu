"use client";

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

const ChatRoom = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState({});

  useEffect(() => {
    socket = io();
    socket.on('connect', (email) => {
      setActiveUsers((prevActiveUsers) => ({...prevActiveUsers, [userId]: true }));
    });
    
    socket.on('disconnect', (userId) => {
      setActiveUsers((prevActiveUsers) => ({...prevActiveUsers, [userId]: false }));
    });

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      {Object.keys(activeUsers).map((userId) => (
    <li key={userId}>{userId} is online</li>
  ))}
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
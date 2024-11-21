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
    
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('updateActiveUsers', (users) => {
      setActiveUsers(users);
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
    if (message.trim()) {
      socket.emit('message', { text: message, sender: socket.id });
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Active Users:</h2>
      <ul>
        {Object.entries(activeUsers).map(([id, email]) => (
          <li key={id}>{email} is online</li>
        ))}
      </ul>
      <h2>Messages:</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.sender}: {msg.text}</li>
        ))}
      </ul>
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
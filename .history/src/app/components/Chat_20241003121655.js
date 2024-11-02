import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import UserList from './UserList';

let socket;

const ChatBoard = ({ username, room }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      socket.emit('setUsername', { username, room: room.roomID });
    });

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('updateUserList', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    return () => {
      socket.disconnect();
    };
  }, [room, username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', { text: message, sender: username, room: room.roomID });
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <UserList users={users} />
      <form onSubmit={sendMessage} className="p-4 bg-gray-200">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        <button type="submit" className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          ส่ง
        </button>
      </form>
    </div>
  );
};

export default ChatBoard;
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import io from 'socket.io-client';
import Image from 'next/image';
import char from '/public/asset/cha.png';

let socket;

const ChatBoard = ({ username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      console.log('เชื่อมต่อกับเซิร์ฟเวอร์แล้ว');
      socket.emit('setUsername', username);
    });

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { ...msg, time: new Date() }]);
    });

    socket.on('userJoined', (newUser) => {
      setUsers((prevUsers) => [...prevUsers, newUser]);
    });

    socket.on('userLeft', (leftUser) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user !== leftUser));
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', { text: message, sender: username, time: new Date() });
      setMessage('');
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", flexDirection: "column" }}>
      <div className="flex-1 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2">ข้อความ:</h2>
        <div className="flex-1 overflow-y-auto mb-4 border p-2">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 p-2 rounded ${msg.type === 'system' ? 'bg-gray-200' : 'bg-blue-100'}`}>
              {msg.type === 'system' ? (
                <p className="text-gray-500 italic">{msg.text}</p>
              ) : (
                <p><strong>{msg.sender}:</strong> {msg.text}</p>
              )}
              <span className="text-xs text-gray-500">{msg.time.toLocaleTimeString()}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-row">
          {/* Chat Box */}
          <form onSubmit={sendMessage} className="flex-grow mr-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="พิมพ์ข้อความ..."
              className="flex-grow border p-2 mr-2"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">ส่ง</button>
          </form>

          {/* Users and Characters */}
          <div className="user-list">
            <h3>ผู้ใช้:</h3>
            {users.map((user, index) => (
              <div key={index} className="user-character">
                <p>{user}</p>
                {/* Display a character icon */}
                <img src="/path/to/character-icon.png" alt="user icon" />
              </div>
            ))}
          </div>
        </div>

        <Link href="/welcome">
          <button className="mt-4 bg-gray-300 p-2 rounded">กลับ</button>
        </Link>
      </div>
    </div>
  );
};

export default ChatBoard;

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import io from 'socket.io-client';
import UserList from '@/app/components//UserList'; 

let socket;

const ChatBoard = ({ username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      console.log('เชื่อมต่อกับเซิร์ฟเวอร์สำเร็จ');
      socket.emit('setUsername', username, (response) => {
        if (response.success) {
          console.log('ตั้งค่า username สำเร็จ');
        } else {
          console.log('ตั้งค่า username ล้มเหลว:', response.message);
        }
      });
    });

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { ...msg, time: new Date() }]);
    });

    socket.on('userJoined', (newUser) => {
      setMessages((prevMessages) => [
        ...prevMessages, 
        { sender: 'system', text: `${newUser.username} เข้าร่วมแชท`, time: new Date(), type: 'system' }
      ]);
    });

    socket.on('userLeft', (leftUser) => {
      setMessages((prevMessages) => [
        ...prevMessages, 
        { sender: 'system', text: `${leftUser.username} ออกจากห้องแชท`, time: new Date(), type: 'system' }
      ]);
    });

    socket.on('updateUserList', (updatedUsers) => {
      setUsers(updatedUsers);
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
        /
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 p-2 rounded ${msg.type === 'system' ? 'bg-gray-200' : 'bg-blue-100'}`}>
              {msg.type === 'system' ? (
                <p className="text-gray-500 italic">{msg.text}</p>
              ) : (
                <p><strong>{msg.sender}:</strong> {msg.text}</p>
              )}
              <span className="text-xs text-gray-500">{new Date(msg.time).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-row">
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

          <UserList users={users} />
          </div>

        </div>

        <div>
          <Link href="/welcome">
            <button className="mt-4 bg-gray-300 p-2 rounded">กลับ</button>
          </Link>
        </div>
      </div>
    
  );
};

export default ChatBoard;
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import io from 'socket.io-client';
import UserList from '@/app/components/UserList';

let socket;

const ChatBoard = ({ username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // ใช้ 12 สำหรับเที่ยงคืนและเที่ยงวัน
    return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

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
      const formattedTime = formatTime(new Date());
      setMessages((prevMessages) => [...prevMessages, { ...msg, time: formattedTime }]);
    });

    socket.on('userJoined', (newUser) => {
      const formattedTime = formatTime(new Date());
      setMessages((prevMessages) => [
        ...prevMessages, 
        { sender: 'system', text: `${newUser.username} เข้าร่วมแชท`, time: formattedTime, type: 'system' }
      ]);
    });

    socket.on('userLeft', (leftUser) => {
      const formattedTime = formatTime(new Date());
      setMessages((prevMessages) => [
        ...prevMessages, 
        { sender: 'system', text: `${leftUser.username} ออกจากห้องแชท`, time: formattedTime, type: 'system' }
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
      const formattedTime = formatTime(new Date());
      socket.emit('message', { text: message, sender: username, time: formattedTime });
      setMessage('');
    }
  };

  return (
    <><div className="flex h-full">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <UserList users={users} />
      </div>
      <div className="w-3/4 flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4 p-4 border rounded">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 p-2 rounded ${msg.type === 'system' ? 'bg-gray-200' : 'bg-blue-100'}`}>
              <p><strong>{msg.sender}:</strong> {msg.text}</p>
              <span className="text-xs text-gray-500">{new Date(msg.time).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            className="flex-grow p-2 border rounded-l" />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">ส่ง</button>
        </form>
      </div>
    </div><div>
        <Link href="/welcome">
          <button className="mt-4 bg-gray-300 p-2 rounded">กลับ</button>
        </Link>
      </div></>
     
  );
};

export default ChatBoard;
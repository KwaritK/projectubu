"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import io from 'socket.io-client';

let socket;

const ChatRoom = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      console.log('เชื่อมต่อกับเซิร์ฟเวอร์แล้ว');
    });

   

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('setUsername', username);
      setIsLoggedIn(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', { text: message, sender: username, time: new Date() });
      setMessage('');
    }
  };

  const handleUserClick = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  const handleReport = useCallback((user) => {
    // ฟังก์ชันจำลองสำหรับการรายงานผู้ใช้
    console.log(`รายงานผู้ใช้: ${user}`);
    alert(`ได้รายงานผู้ใช้ ${user} แล้ว`);
    setSelectedUser(null);
  }, []);

  if (!isLoggedIn) {
    return (
      <form onSubmit={handleLogin} className="p-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ใส่ชื่อผู้ใช้ของคุณ"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">เข้าร่วมแชท</button>
      </form>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-2">ผู้ใช้ที่ออนไลน์:</h2>
        <ul>
          {activeUsers.map((user, index) => (
            <li 
              key={index} 
              className="cursor-pointer text-blue-500 hover:underline mb-1" 
              onClick={() => handleUserClick(user)}
            >
              {user}
            </li>
          ))}
        </ul>
      </div>
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
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            className="flex-grow border p-2 mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">ส่ง</button>
        </form>
        <Link href="/createroom">
          <button className="mt-4 bg-gray-300 p-2 rounded">กลับ</button>
        </Link>
      </div>
      
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <h3 className="text-lg font-bold mb-2">{selectedUser}</h3>
            <p>ข้อมูลเพิ่มเติมของ {selectedUser}</p>
            <button onClick={() => handleReport(selectedUser)} className="mt-2 bg-red-500 text-white p-2 rounded mr-2">รายงาน</button>
            <button onClick={() => setSelectedUser(null)} className="mt-2 bg-blue-500 text-white p-2 rounded">ปิด</button>
          </div>
        </div>
      )}
    </div>
  );


export default ChatRoomว
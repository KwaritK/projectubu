"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import io from 'socket.io-client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

let socket;

const ChatRoom = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      console.log('เชื่อมต่อกับเซิร์ฟเวอร์แล้ว');
    });

    socket.on('updateActiveUsers', (users) => {
      setActiveUsers(Object.values(users));
    });

    // รับการแจ้งเตือนเมื่อมีผู้ใช้เข้าร่วม
    socket.on('userJoined', (username) => {
      setMessages((prevMessages) => [...prevMessages, { type: 'system', text: `${username} เข้าร่วมแชท` }]);
    });

    // รับการแจ้งเตือนเมื่อมีผู้ใช้ออกจากห้อง
    socket.on('userLeft', (username) => {
      setMessages((prevMessages) => [...prevMessages, { type: 'system', text: `${username} ออกจากแชท` }]);
    });

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { type: 'user', ...msg }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
      socket.emit('message', { text: message, sender: username });
      setMessage('');
    }
  };

  const handleUserClick = useCallback((user) => {
    setSelectedUser(user);
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">ผู้ใช้ที่ออนไลน์:</h2>
      <ul className="mb-4">
        {activeUsers.map((user, index) => (
          <li key={index} className="cursor-pointer text-blue-500 hover:underline" onClick={() => handleUserClick(user)}>{user}</li>
        ))}
      </ul>
      <h2 className="text-xl font-bold mb-2">ข้อความ:</h2>
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <Card key={index} className="mb-2">
            <CardContent className="p-2">
              {msg.type === 'system' ? (
                <p className="text-gray-500 italic">{msg.text}</p>
              ) : (
                <p><strong>{msg.sender}:</strong> {msg.text}</p>
              )}
            </CardContent>
          </Card>
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
      <Link href="/C">
        <button className="mt-4 bg-gray-300 p-2 rounded">กลับ</button>
      </Link>
      
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser}</DialogTitle>
          </DialogHeader>
          <p>นี่เป็นที่สำหรับฟีเจอร์ในอนาคตที่เกี่ยวข้องกับ {selectedUser}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatRoom;
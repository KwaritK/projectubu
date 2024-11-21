"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import io from 'socket.io-client';
import Image from 'next/image';
import char from '/public/asset/char.png';

let socket;

const ChatBoard = ({ username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    // Ensure only one socket connection
    if (!socketRef.current) {
      socketRef.current = io();
      
      socketRef.current.on('connect', () => {
        console.log('เชื่อมต่อกับเซิร์ฟเวอร์สำเร็จ');
        socketRef.current.emit('setUsername', username, (response) => {
          if (response.success) {
            console.log('ตั้งค่า username สำเร็จ');
          } else {
            console.log('ตั้งค่า username ล้มเหลว:', response.message);
          }
        });
      });

      socketRef.current.on('reconnect', () => {
        console.log('Socket รีเชื่อมต่อ');
        socketRef.current.emit('setUsername', username, (response) => {
          if (response.success) {
            console.log('ตั้งค่า username สำเร็จอีกครั้งหลังจากรีเชื่อมต่อ');
          } else {
            console.log('ตั้งค่า username ล้มเหลวหลังจากรีเชื่อมต่อ:', response.message);
          }
        });
      });

      socketRef.current.on('disconnect', () => {
        console.log('การเชื่อมต่อกับเซิร์ฟเวอร์ถูกตัดการเชื่อมต่อ');
      });

      socketRef.current.on('reconnect_error', (error) => {
        console.log('รีเชื่อมต่อไม่สำเร็จ', error);
      });

      // Listen for new messages
      socketRef.current.on('message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, { ...msg, time: new Date() }]);
      });

      // Listen for new user joining
      socketRef.current.on('userJoined', (newUser) => {
        console.log(`${newUser.username} เข้าร่วมแชท`);
        setUsers((prevUsers) => [...prevUsers, newUser]);
        
        // Add a system message to notify other users of the new join
        setMessages((prevMessages) => [
          ...prevMessages, 
          { sender: 'system', text: `${newUser.username} เข้าร่วมแชท`, time: new Date(), type: 'system' }
        ]);
      });

      // Listen for user leaving
      socketRef.current.on('userLeft', (leftUser) => {
        console.log(`${leftUser.username} ออกจากห้อง`);
        setUsers((prevUsers) => prevUsers.filter((user) => user.username !== leftUser.username));
        
        // Add a system message to notify users of someone leaving
        setMessages((prevMessages) => [
          ...prevMessages, 
          { sender: 'system', text: `${leftUser.username} ออกจากห้องแชท`, time: new Date(), type: 'system' }
        ]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socketRef.current.emit('message', { text: message, sender: username, time: new Date() });
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
              <div key={index} className="user-character flex items-center mb-2">
                {/* Display a character icon */}
                <Image 
                src={char} 
                alt={`${user.username} icon`}  
                className="w-6 h-6 rounded-full mr-2"/>
                <p>{user.username}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Link href="/welcome">
            <button className="mt-4 bg-gray-300 p-2 rounded">กลับ</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatBoard;

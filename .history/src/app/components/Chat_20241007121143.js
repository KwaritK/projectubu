"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import io from 'socket.io-client';
import UserList from '@/app/components/UserList'; //เอาข้อมูลเข้าออกมาแสดง

let socket;

const ChatBoard = ({ username ,roomID }) => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]); //รับจากcomponent setuser
  const messagesEndRef = useRef(null);
  



  const formatTime = (date) => { //กำหนดรูปแบบเวลาที่แสดง
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // ใช้ 12 สำหรับเที่ยงคืนและเที่ยงวัน
    return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  useEffect(() => {
    socket = io();

    socket.on('connect', () => { //ตรวจสอบการกำหนดในระบบ
      console.log('เชื่อมต่อกับเซิร์ฟเวอร์สำเร็จ');
      socket.emit('setUsername', { username, roomID }, (response) => {
        if (response.success) {
          console.log('ตั้งค่า username และเข้าร่วมห้องสำเร็จ');
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

    socket.on('updateUserCount', (count) => {
      setUserCount(count);
    });

    
  
    return () => {
      socket.disconnect();

    };
  }, [username, roomID]);

  

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const formattedTime = formatTime(new Date());
      socket.emit('message', { text: message, sender: username,roomID, time: formattedTime });
      setMessage('');
    }
  };
  const leaveChat = (e) => {
    e.preventDefault();
    const confirmLeave = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการออกจากห้องแชท?');
    if (confirmLeave) {
      socket.disconnect();
      router.push('/welcome');
    }
  };

  return (
    <div style={{ display: 'flex', height: '60vh', maxWidth: '100%', padding: '20px' }}>
      <div style={{ flex: '0 0 200px', marginRight: '20px', overflowY: 'auto' }}>
        <UserList users={users} />
      </div>
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-bold mb-2">Chat Messages:</h2>
        <div className="flex-1 overflow-y-auto mb-4 border p-2" style={{ maxHeight: '50vh' }}>
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 p-2 rounded ${msg.type === 'system' ? 'bg-gray-200' : 'bg-blue-100'}`}>
              {msg.type === 'system' ? (
                <p className="text-gray-500 italic">{msg.text}</p>
              ) : (
                <p><strong>{msg.sender}:</strong> {msg.text}</p>
              )}
              <span className="text-xs text-gray-500">{msg.time}</span>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow border p-2 mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Send</button>
        </form>
        <Link href="/welcome">
          <button className="mt-4 bg-gray-300 p-2 rounded" onClick={leaveChat}>
            Back
          </button>
        </Link>
      </div>
    </div>
  );
};
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';
import UserList from '@/app/components/UserList';

// สร้าง socket instance นอก component
let socket;

const ChatBoard = ({ username, roomID }) => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const { data: session } = useSession();
  

  const formatTime = (date) => { //กำหนดรูปแบบเวลาที่แสดง
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // ใช้ 12 สำหรับเที่ยงคืนและเที่ยงวัน
    return ${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm};
  };
  
  // แยก event handlers ออกมาเพื่อความเป็นระเบียบ
  const handleMessage = (msg) => {
    const formattedTime = formatTime(new Date());
    setMessages(prev => [...prev, { ...msg, time: formattedTime }]);
  };

  const handleUserJoined = (newUser) => {
    const formattedTime = formatTime(new Date());
    setMessages(prev => [
      ...prev, 
      { 
        sender: 'system', 
        text: `${newUser.username} เข้าร่วมแชท`, 
        time: formattedTime, 
        type: 'system' 
      }
    ]);
  };

  const handleUserLeft = (leftUser) => {
    const formattedTime = formatTime(new Date());
    setMessages(prev => [
      ...prev, 
      { 
        sender: 'system', 
        text: `${leftUser.username} ออกจากห้องแชท`, 
        time: formattedTime, 
        type: 'system' 
      }
    ]);
  };

  useEffect(() => {
    // สร้าง socket เฉพาะเมื่อยังไม่มี
    if (!socket) {
      socket = io({
        reconnection: true,        // เปิดใช้งานการเชื่อมต่อใหม่อัตโนมัติ
        reconnectionAttempts: 5,   // พยายามเชื่อมต่อใหม่สูงสุด 5 ครั้ง
        reconnectionDelay: 1000,   // รอ 1 วินาทีก่อนพยายามเชื่อมต่อใหม่
        query: {                   // ส่งข้อมูลเพิ่มเติมไปกับการเชื่อมต่อ
          username,
          roomID
        }
      });
    }

    // ตั้งค่า event listeners เมื่อ component mount
    socket.on('connect', () => {
      console.log('เชื่อมต่อกับเซิร์ฟเวอร์สำเร็จ');
      socket.emit('joinRoom', { 
        username, 
        email: session.user.email, 
        roomID 
      });
    });

    socket.on('message', handleMessage);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('updateUserList', setUsers);

    // เพิ่มการจัดการ reconnect
    socket.on('reconnect', () => {
      console.log('เชื่อมต่อใหม่สำเร็จ');
      socket.emit('joinRoom', { 
        username, 
        email: session.user.email, 
        roomID 
      });
    });

    // Cleanup function
    return () => {
      // ลบ event listeners ทั้งหมดเมื่อ component unmount
      socket.off('message', handleMessage);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('updateUserList', setUsers);
      socket.off('reconnect');
      
      // ตัดการเชื่อมต่อ socket
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [username, roomID, session.user.email]); // dependencies ที่สำคัญ

  // ปรับปรุงฟังก์ชัน leaveChat
  const leaveChat = (e) => {
    e.preventDefault();
    const confirmLeave = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการออกจากห้องแชท?');
    if (confirmLeave) {
      // ส่ง event แจ้งเซิร์ฟเวอร์ก่อนออกจากห้อง
      socket.emit('leaveRoom', { username, roomID });
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
        <h2 className="text-xl font-bold mb-2">กล่องสนทนา:</h2>
        <div className="flex-1 overflow-y-auto mb-4 border p-2">
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
  <div ref={messagesEndRef}></div>
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
        
        <button className="mt-4 bg-gray-300 p-2 rounded" onClick={leaveChat}>
            กลับ
        </button>


      </div>
    </div>
  );
};

export default ChatBoard;
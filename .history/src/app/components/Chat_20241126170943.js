"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';
import UserList from '@/app/components/UserList'; //เอาข้อมูลเข้าออกมาแสดง

let socket = null ;

const ChatBoard = ({ roomID }) => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]); //รับจากcomponent setuser
  const messagesEndRef = useRef(null);
  const { data: session } = useSession();
    // ใช้ username จาก session โดยตรง
  const username = session?.user?.name || session?.user?.email;
  

  // ใช้ useRef เพื่อเก็บสถานะการเชื่อมต่อ
  const socketInitialized = useRef(false);

  const formatTime = (date) => { //กำหนดรูปแบบเวลาที่แสดง
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // ใช้ 12 สำหรับเที่ยงคืนและเที่ยงวัน
    return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  useEffect(() => {

    // ตรวจสอบว่ายังไม่เคยสร้าง socket หรือ socket ถูกปิด
    if (!socket || !socketInitialized.current) {
      // ปิด socket เก่าที่อาจมีอยู่
      if (socket) {
        socket.disconnect();
      }
    
      // สร้าง socket ใหม่
      socket = io(undefined, {
        reconnection: false, // ปิดการ reconnect อัตโนมัติ
      });

    
      
     socket.on('connect', () => {
       console.log('เชื่อมต่อสำเร็จ');
       
       // ตรวจสอบ username ก่อนส่ง
       if (username) {
        socket.emit('joinRoom', { 
          username, 
          email: session.user.email, 
          roomID 
        });

        socketInitialized.current = true;
        } else {
          console.error('ไม่มี username');
        }
      });


     socket.on('connect_error', (error) => {
      console.error('เชื่อมต่อล้มเหลว:', error);
      socketInitialized.current = false;
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
      if (socket) {
      socket.off('connect');
    socket.off('message');
    socket.off('userJoined');
    socket.off('userLeft');
    socket.off('updateUserList');
    socket.disconnect();
    socketInitialized.current = false;
  }
}
};
}, [roomID, session?.user?.email,username]); // dependencies ที่ทำให้ effect รันใหม่
  
  

useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && username) {
      const formattedTime = formatTime(new Date());
      socket.emit('message', { 
        text: message, 
        sender: username, 
        roomID, 
        time: formattedTime 
      });
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
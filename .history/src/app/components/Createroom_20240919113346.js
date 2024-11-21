"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './CreateRoom.css';


const CreateRoom = () => {
  const router = useRouter();

  // สร้าง state เพื่อเก็บข้อมูลที่ผู้ใช้กรอก
  const [roomType, setRoomType] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [error, setError] = useState('');

  // ฟังก์ชันจัดการเมื่อผู้ใช้กดปุ่มเพื่อเลือก Room Type
  const handleRoomTypeClick = (type) => {
    setRoomType(type);
  };

      // ฟังก์ชันจัดการเมื่อผู้ใช้กดปุ่มเพื่อเลือก Age Group
  const handleAgeGroupClick = (group) => {
    setAgeGroup(group);
  };

  // ฟังก์ชันเมื่อกดปุ่มส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจเช็คว่าผู้ใช้ระบุข้อมูลครบ
    if (!roomType || !ageGroup) {
      setError('Please select both room type and age group');
      return;
    }


    // ส่งข้อมูลไปยัง API เพื่อสร้างห้องแชท
    try {
      const res = await fetch('/api/createroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomType, ageGroup }),
      });

      const data = await res.json();

      if (res.ok) {
        // ถ้าสร้างห้องสำเร็จ ให้ใช้ roomID ที่ส่งกลับมาพาผู้ใช้ไปยังหน้าห้องแชท
      router.push(`/roomtag/${data.room.roomID}`);
        } else {
          setError(data.error || 'Error creating room');
        }
      } catch (error) {
        setError('Failed to create room');
      }
    };


  return (
    <div className="modal-container">
    
      <h1> New Chat Room</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    
      <div>
        <h3>เลือกแบบไหน:</h3>
        <div className="button-group">
          <button onClick={() => handleRoomTypeClick('one-on-one')} className={`button ${roomType === 'one-on-one' ? 'active' : ''}`}>
            One on One
          </button>
          <button onClick={() => handleRoomTypeClick('multi')} className={`button ${roomType === 'multi' ? 'active' : ''}`}>
            Up to 5 people
          </button>
        </div>

        <h3>อยากคุยกับคนกลุ่มไหน:</h3>
        <div className="button-group">
          <button onClick={() => handleAgeGroupClick('any')} className={`button ${ageGroup === 'any' ? 'active' : ''}`}>
            วัยไหนก็ได้
          </button>
          <button onClick={() => handleAgeGroupClick('high-school')} className={`button ${ageGroup === 'high-school' ? 'active' : ''}`}>
            มัธยมปลาย
          </button>
          <button onClick={() => handleAgeGroupClick('university')} className={`button ${ageGroup === 'university' ? 'active' : ''}`}>
            มหาลัย
          </button>
          <button onClick={() => handleAgeGroupClick('working')} className={`button ${ageGroup === 'working' ? 'active' : ''}`}>
            วัยทำงาน
          </button>
        </div>

        <button onClick={handleSubmit}>Create Room</button>
      </div>
    </div>
  );
};

export default CreateRoom;
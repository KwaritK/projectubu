"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateRoom = () => {
  const router = useRouter();

  // สร้าง state เพื่อเก็บข้อมูลที่ผู้ใช้กรอก
  const [roomType, setRoomType] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [error, setError] = useState('');

  // ฟังก์ชันจัดการเมื่อผู้ใช้ส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าผู้ใช้กรอกข้อมูลครบ
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
    <div>
      <h1> New Chat Room</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Room Type:
          <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
            <option value="">Select room type</option>
            <option value="one-on-one">One-on-One</option>
            <option value="multi">Multi</option>
          </select>
        </label>

        <label>
          Age Group:
          <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
            <option value="">Select age group</option>
            <option value="any">Any</option>
            <option value="high-school">High School</option>
            <option value="university">University</option>
            <option value="working">Working</option>
          </select>
        </label>

        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default CreateRoom;

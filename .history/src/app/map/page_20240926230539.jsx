"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import Navbar from "../../../public/asset/Navbar";
import map from '/public/asset/MM.png'; // ยังคงใช้รูปนี้
import Link from 'next/link';

const MapPage = () => {

  const { data: session } = useSession();
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#C4BB91',
        backgroundImage: `url(${map.src})`, // ใช้ background image
        backgroundSize: '70%', // ปรับขนาดพื้นหลังที่นี่
        backgroundPosition: 'center', // จัดให้อยู่ตรงกลาง
        backgroundRepeat: 'no-repeat', // ไม่ให้พื้นหลังซ้ำ
      }}
    >

      {/* ปุ่มสำหรับเข้าสู่ห้องแชท */}
      <button
        style={{
          position: 'absolute',
          top: '55%',
          left: '34%',
          padding: '10px 20px',
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        onClick={() => alert('เข้าสู่ห้องแชท')}
      >
        กดที่นี้
      </button>
      <button
        style={{
          position: 'absolute',
          top: '45%',
          left: '48%',
          padding: '10px 20px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        onClick={() => alert('เข้าสู่ห้องแชท')}
      >
        กดที่นี้
      </button>

      {/* ปุ่มสำหรับเริ่มเกม */}
      <button
        style={{
          position: 'absolute',
          top: '39%',
          left: '64%',
          padding: '10px 20px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        onClick={() => alert('เริ่มเกม')}
      >
        คลิ้ก
      </button>

      {/* Navbar */}
      <Navbar session={session} />
    </div>
  );
}

export default MapPage;

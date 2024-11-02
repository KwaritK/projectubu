"use client";

import React from 'react';
import Image from 'next/image';
import map from '/public/asset/MM.png';

function Page() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#C4BB91', // สีพื้นหลัง
      }}
    >
      <Image
        alt="Map Background"
        src={map}
        layout="fill" // ทำให้ภาพครอบคลุมพื้นที่
        objectFit="contain" // ทำให้ภาพคงอัตราส่วน
        objectPosition="center" // จัดกึ่งกลางภาพ
        quality={100} // คุณภาพสูงสุด
      />

      {/* ปุ่มสำหรับเข้าสู่ห้องแชท */}
      <button
        style={{
          position: 'absolute',
          top: '30%', // ตำแหน่งของปุ่มแรก
          left: '20%',
          padding: '10px 20px',
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        onClick={() => alert('เข้าสู่ห้องแชท')} // ตัวอย่างการคลิกปุ่ม
      >
        กดที่นี้
      </button>

      {/* ปุ่มสำหรับเริ่มเกม */}
      <button
        style={{
          position: 'absolute',
          top: '50%',
          left: '70%',
          padding: '10px 20px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        onClick={() => alert('เริ่มเกม')} // ตัวอย่างการคลิกปุ่ม
      >
        คลิ้ก
      </button>
    </div>
  );
}

export default Page;

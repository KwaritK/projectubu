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
      
      {/* คุณสามารถเพิ่มจุดอีเวนต์ที่นี่ */}
      <div
        style={{
          position: 'absolute',
          top: '30%', // ตำแหน่งของจุดแรก
          left: '20%',
          width: '50px',
          height: '50px',
          backgroundColor: 'red', // สีแดงเพื่อดูง่าย
          borderRadius: '50%',
          cursor: 'pointer', // เพิ่ม cursor เพื่อให้ผู้ใช้รู้ว่าคลิกได้
        }}
        onClick={() => alert('เข้าสู่ห้องแชท')} // ตัวอย่างการคลิกจุด
      />
      <div
        style={{
          position: 'absolute',
          top: '30%', // ตำแหน่งของจุดแรก
          left: '20%',
          width: '50px',
          height: '50px',
          backgroundColor: 'red', // สีแดงเพื่อดูง่าย
          borderRadius: '50%',
          cursor: 'pointer', // เพิ่ม cursor เพื่อให้ผู้ใช้รู้ว่าคลิกได้
        }}
        onClick={() => alert('เข้าสู่ห้องแชท')} // ตัวอย่างการคลิกจุด
      />
      
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '70%',
          width: '50px',
          height: '50px',
          backgroundColor: 'blue', // สีฟ้าเพื่อดูง่าย
          borderRadius: '50%',
          cursor: 'pointer', // เพิ่ม cursor เพื่อให้ผู้ใช้รู้ว่าคลิกได้
        }}
        onClick={() => alert('เริ่มเกม')} // ตัวอย่างการคลิกจุด
      />
    </div>
  );
}

export default Page;

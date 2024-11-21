"use client";

import React from 'react'
import Image from 'next/image'
import map from '/public/asset/MAP.png';

function page() {
    
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh', // ปรับให้เต็มหน้าจอ
        overflow: 'hidden', // ป้องกันการเลื่อนจอ
      }}
    >
      <Image
        alt="Map Background"
        src={map}
        layout="fill" // ทำให้ภาพครอบคลุมพื้นที่ทั้งหมด
        objectFit="cover" // ปรับขนาดภาพให้พอดีกับขนาดของพื้นที่
        quality={750} // คุณภาพของภาพ
      />
    </div>
  );
}
export default page

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
        height: '100vh', // ตั้งค่าให้ครอบคลุมหน้าจอทั้งหมด
        backgroundImage: `url(${map.src})`,
        backgroundSize: 'cover', // ปรับขนาดให้พอดีกับพื้นที่
        backgroundPosition: 'center', // จัดกึ่งกลางภาพ
        backgroundRepeat: 'no-repeat', // ไม่ให้ภาพซ้ำ
      }}
    >
      {/* เนื้อหาภายใน component */}
    </div>
  );
}

export default page

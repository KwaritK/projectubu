"use client";

import React from 'react'
import Image from 'next/image'
import map from '/public/asset/MM.png';

function page() {
    
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Image
      alt="Map Background"
      src={map}
      width={1920} // กำหนดความกว้างตามต้องการ
      height={900} // กำหนดความสูงตามต้องการ
      sizes="100vw"
      style={{
        width: '100%', // ปรับให้ครอบคลุมพื้นที่ตามขนาดหน้าจอ
        height: 'auto',
      }}
    />
  </div>
);
}

export default page

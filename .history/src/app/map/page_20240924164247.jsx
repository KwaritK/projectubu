"use client";

import React from 'react'
import Image from 'next/image'
import map from '/public/asset/MM.png';

function page() {
    
    return (
        <div
          style={{
            position: 'relative',
            width: '100vw',
            height: '100vh', // ทำให้ครอบคลุมทั้งหน้าจอ
            backgroundColor: '#f0e68c', // เพิ่มสีพื้นหลัง (สามารถปรับเปลี่ยนได้)
            display: 'flex',
            justifyContent: 'center', // จัดกึ่งกลางแนวนอน
            alignItems: 'center', // จัดกึ่งกลางแนวตั้ง
            overflow: 'hidden',
          }}
        >
          <Image
            alt="Map Background"
            src={map}
            layout="intrinsic" // ใช้ขนาดตามภาพที่กำหนด
            width={1920} // ขนาดจริงของภาพ
            height={1241} // ขนาดจริงของภาพ
            objectFit="contain" // ให้ภาพแสดงผลตามอัตราส่วนเดิมโดยไม่ครอบตัด
            quality={100} // คุณภาพสูงสุด
          />
        </div>
      );
    }
    
    
export default page

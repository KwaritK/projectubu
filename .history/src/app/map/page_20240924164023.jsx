"use client";

import React from 'react'
import Image from 'next/image'
import map from '/public/asset/mm.png';

function page() {
    
    return (
        <div
          style={{
            position: 'relative',
            width: '100vw',
            height: '100vh', // ทำให้ครอบคลุมหน้าจอ
            overflow: 'hidden', // ป้องกันการเลื่อน
          }}
        >
          <Image
            alt="Map Background"
            src={map}
            layout="fill" // ทำให้ภาพครอบคลุมพื้นที่
            objectFit="contain" // ทำให้ภาพคงอัตราส่วนและพอดีหน้าจอ
            objectPosition="center" // จัดกึ่งกลางภาพ
            quality={100} // เพิ่มคุณภาพสูงสุด
          />
        </div>
      );
    }
    
export default page

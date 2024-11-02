"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import Image from 'next/image';
import map from '/public/asset/MM.png';
import Navbar from "../../../public/asset/Navbar";


const MapPage = () => {

  const { data: session } = useSession();
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
       <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1, // ทำให้รูปอยู่ข้างหลังทุกองค์ประกอบ
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
          top: '60%', // ตำแหน่งของปุ่มแรก
          left: '30%',
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
      <button
        style={{
          position: 'absolute',
          top: '40%', // ตำแหน่งของปุ่มแรก
          left: '45%',
          padding: '10px 20px',
          backgroundColor: 'green',
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
          top: '35%',
          left: '63%',
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
      <Navbar session={session} />
    </div>
  );
}

export default MapPage;

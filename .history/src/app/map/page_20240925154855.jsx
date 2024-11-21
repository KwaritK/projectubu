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
        backgroundColor: '#C4BB91',
      }}
    >
      {/* ใช้ position: relative สำหรับ container ของรูปภาพ */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <Image
          alt="Map Background"
          src={map}
          layout="fill"
          objectFit="cover" // ปรับให้รูปครอบคลุมพื้นที่ทั้งหมด
          objectPosition="center"
          quality={100}
          style={{ zIndex: -1 }} // ให้รูปอยู่ด้านหลังองค์ประกอบอื่น
        />
      </div>

      {/* ปุ่มสำหรับเข้าสู่ห้องแชท */}
      <button
        style={{
          position: 'absolute',
          top: '60%',
          left: '30%',
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
          top: '40%',
          left: '45%',
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
          top: '35%',
          left: '63%',
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

      {/* Navbar จะอยู่เหนือรูปและใช้งานได้ */}
      <Navbar session={session} />
    </div>
  );
}

export default MapPage;

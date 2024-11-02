"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { redirect } from 'next/navigation';
import Navbar from "../../../public/asset/Navbar";
import map from '/public/asset/MM.png'; // ยังคงใช้รูปนี้
import Link from 'next/link';

const MapPage = () => {

  const router = useRouter();
  const { data: session } = useSession();
  
  if (!session) redirect('/login');
  useEffect(() => {
    if (status === 'authenticated') {
      if (session.user.isBanned) {
        router.replace('/banned');
      }
    }
  }, [session, status]);

  if (status === 'loading') {
    return <p>Loading...</p>;  // อาจแสดงหน้า loading จนกว่าจะตรวจสอบเสร็จ
  }
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        backgroundImage: `url(${map.src})`, // ใช้ background image
        backgroundSize: '70%', // ปรับขนาดพื้นหลังที่นี่
        backgroundPosition: 'center', // จัดให้อยู่ตรงกลาง
        backgroundRepeat: 'no-repeat', // ไม่ให้พื้นหลังซ้ำ
      }}
    >

      {/* ปุ่มสำหรับเข้าสู่ห้องแชท */}
      <Link href="/welcome">
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
        //alert confirm
        //onClick={() => alert('เข้าสู่ห้องแชท')} 
      >
        กดที่นี้
      </button>
      </Link>
      
      <Link href="/gameroom">           
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
       // onClick={() => alert('เข้าสู่ห้องแชท')}
      >
        กดที่นี้
      </button>
      </Link>

    
      {/* ปุ่มสำหรับเริ่มเกม */}
      <Link Link href="/game3">
      <button
        style={{
          position: 'absolute',
          top: '39%',
          left: '63%',
          padding: '10px 20px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        //onClick={() => alert('เริ่มเกม')}
      >
        คลิ้ก
      </button>
      </Link>

      {/* Navbar */}
      <Navbar session={session} />
    </div>
  );
}

export default MapPage;

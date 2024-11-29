"use client";

import React, { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Navbar from "../../../public/asset/Navbar";
import map from '/public/asset/MM.png';
import Link from 'next/link';
import '../styles.css';

const MapPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // ตรวจสอบการล็อกอิน
  useEffect(() => {
    if (status === 'loading') return; // ยังโหลด session อยู่
    
    // ถ้าไม่มี session ให้ redirect ไปหน้า login
    if (!session) {
      router.push('/login');
      return;
    }

    // ถ้าผู้ใช้ถูกแบน ให้ redirect ไปหน้า banned
    if (session?.user?.isBanned) {
      router.push('/banned');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '109vh',
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
            border: 'dashedc',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
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
            border: 'dashed',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          กดที่นี้
        </button>
      </Link>

      {/* ปุ่มสำหรับเริ่มเกม */}
      <Link href="/game3">
        <button
          style={{
            position: 'absolute',
            top: '39%',
            left: '63%',
            padding: '10px 20px',
            backgroundColor: 'yellow',
            color: 'white',
            border: 'dashed',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          กดที่นี้
        </button>
      </Link>

      {/* Navbar */}
      <Navbar session={session} />
    </div>
  );
};

export default MapPage;

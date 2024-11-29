"use client";

import React, { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Navbar from "../../../public/asset/Navbar";
import map from '/public/asset/MM.png';
import Link from 'next/link';
import '../styles.css';
import Image from 'next/image';
import button from '/public/asset/click.png'; 

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
            left: '32%',
            
            
            
            cursor: 'pointer',
          }}
        >
          <Image src={button} alt="chat" width={150} height={100} />
          
        </button>
      </Link>

      <Link href="/gameroom">
        <button
          style={{
            position: 'absolute',
            top: '45%',
            left: '48%',
            padding: '10px 20px',
            backgroundColor: '#F1C40F',
            color: '#17202A ',
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
            top: '40%',
            left: '63%',
            padding: '10px 20px',
            backgroundColor: '#2ECC71',
            color: '#17202A',
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

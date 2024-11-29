"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../public/asset/Navbar';
import { useSession } from "next-auth/react";
import './Styles.css';
import { useEffect, useRef  } from 'react';
import Phaser from 'phaser';
import HomePage from '/src/app/game3/src/scenes/home.js';
import GamePage from '/src/app/game3/src/scenes/game.js';
import GameOverPage from '/src/app/game3/src/scenes/overpage.js';
import AgainPage from './src/scenes/again';
import Link from 'next/link';
import button from '/public/asset/backk.png'; 
import Image from 'next/image';






export default function Gameroom() {
    const gameRef = useRef(null);
    const { data: session, status } = useSession(); // เพิ่ม status เพื่อตรวจสอบสถานะ session
    const router = useRouter(); // ใช้ router สำหรับ redirect


     // ตรวจสอบสถานะการล็อกอินและการแบน
     useEffect(() => {
      if (status === 'loading') return; // ยังโหลด session อยู่
      if (!session) {
          router.push('/login');
      } else if (session?.user?.isBanned) {
          router.push('/banned');
      }
    }, [session, status, router]);


    useEffect(() => {
        if (typeof window !== 'undefined' && !gameRef.current) {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent:'gameBox', // ตรวจสอบให้ตรงกับ id ของ div
            
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH 
            },
            scene: [HomePage, GamePage, GameOverPage,AgainPage],
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            url: '/game3', // เพิ่มบรรทัดนี้
            baseURL: '/game3' // เพิ่มบรรทัดนี้
        };
        
        gameRef.current = new Phaser.Game(config);
        }

      
    }, []);
    if (status === 'loading') {
      return <p>Loading...</p>; // แสดงข้อความระหว่างโหลด session
  }
  
    return (
      
    <>
    <Navbar session={session} />
    <div className="content-wrapper">
      <h1 id="gameTitle">แม่งูเอ๋ย..กินน้ำบ่อไหน (แบบนี้บ่ไหวดอกแล่นนนนนนนโล้ด)</h1>
      <div id="gameContainer">
        <div id="gameBox">
          
        </div>
      </div>
    </div>
      <div className="flex justify-center ">
          <Link href="/map">
          <button className="custom-button">
              <Image src={button} alt="logButton" width={300} height={100} />
            </button>
          </Link>
        </div>
    </>

);

}

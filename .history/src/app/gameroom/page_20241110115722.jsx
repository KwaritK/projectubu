"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../public/asset/Navbar';
import { useSession } from "next-auth/react";
import './Styles.css';
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import HomePage from '/src/app/gameroom/src/scenes/HomePage.js';
import GamePage from '/src/app/gameroom/src/scenes/GamePage.js';
import GameOverPage from '/src/app/gameroom/src/scenes/GameOverPage.js';
import Link from 'next/link';

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
                width: 1334,
                height: 650,

                parent: 'gameBox',
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH 
                },
                scene: [HomePage,GamePage,GameOverPage],
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 0 },
                        debug: false
                    }
                },
                url: '/gameroom', // เพิ่มบรรทัดนี้
                baseURL: '/gameroom' // เพิ่มบรรทัดนี้
            };
            
            gameRef.current = new Phaser.Game(config);
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);


    if (status === 'loading') {
      return <p>Loading...</p>; // แสดงข้อความระหว่างโหลด session
  }
    return (
        
         
        <>
      <Navbar session={session} />
      <div className="content-wrapper">
        <h1 id="gameTitle">ANGRY สาวน้อยตกน้ำ</h1>
        <div id="gameContainer">
          <div id="gameBox">
            
          </div>
        </div>
      </div>
      <div className="flex justify-center ">
          <Link href="/map">
            <button className="mt-1 bg-gray-300 p-20 rounded">กลับ</button>
          </Link>
        </div>
    </>
        
      );
    }
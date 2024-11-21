"use client";
import { useRouter } from 'next/navigation';
import Navbar from '../../../public/asset/Navbar';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import './Styles.css';
import { useEffect, useRef  } from 'react';
import Phaser from 'phaser';
import HomePage from '/src/app/game3/src/scenes/home.js';
import GamePage from '/src/app/game3/src/scenes/game.js';
import GameOverPage from '/src/app/game3/src/scenes/overpage.js';
import AgainPage from './src/scenes/again';
import Link from 'next/link';






export default function Gameroom() {
    const gameRef = useRef(null);
    const { data: session } = useSession();
    if (!session) redirect('/login');
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
    <div>
          <Link href="/map">
            <button className="mt-4 bg-gray-300 p-2 rounded">กลับ</button>
          </Link>
        </div>
  </>

);

}

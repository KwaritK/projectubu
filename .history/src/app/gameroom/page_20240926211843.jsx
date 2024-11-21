"use client";
import Navbar from '../../../public/asset/Navbar';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import './Styles.css';
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import HomePage from '/src/app/gameroom/src/scenes/HomePage.js';
import GamePage from '/src/app/gameroom/src/scenes/GamePage.js';
import GameOverPage from '/src/app/gameroom/src/scenes/GameOverPage.js';
import Link from 'next/link';

export default function Gameroom() {
    const gameRef = useRef(null);
    const { data: session } = useSession();
    if (!session) redirect('/login');

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
                        debug: true
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
      <div>
          <Link href="/welcome">
            <button className="mt-4 bg-gray-300 p-2 rounded">กลับ</button>
          </Link>
        </div>
    </>
        
      );
    }
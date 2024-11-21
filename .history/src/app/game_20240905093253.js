"use client";
import { useEffect } from 'react';
import Phaser from 'phaser';
import HomePage from './game3/src/scenes/home.js';
import Game from './game3/src/scenes/game.js';
import GameOverPage from './game3/src/scenes/overpage.js';
 // นำเข้าฉากหลักของเกม
import './game3/src/main.js'; // นำเข้าตัวเกมหลัก

const GamePage = () => {
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'gameBox',
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH 
            },
            scene: [ HomePage,Game, GameOverPage],
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: true
                }
            }
        };

    // ตรวจสอบว่าเกมมีอยู่แล้วหรือไม่ เพื่อป้องกันการซ้ำซ้อน
    if (!window.game) {
      window.game = new Phaser.Game(config); // สร้างเกมใหม่เมื่อ component ถูก mount
    }

    // ทำลายเกมเมื่อ component ถูก unmount เพื่อให้ไม่มีปัญหาเกมซ้ำกัน
    return () => {
      if (window.game) {
        window.game.destroy(true);
        window.game = null;
      }
    };
  }, []);

  return (
    <div id="game-container">
      {/* Phaser จะ render เกมภายใน div นี้ */}
    </div>
  );
};

export default GamePage;

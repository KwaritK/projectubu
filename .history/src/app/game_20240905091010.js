import { useEffect } from 'react';
import Phaser from 'phaser';
import GameScene from '../game3/src/main'; // นำเข้าฉากหลักของเกม
import '../game3/src/main'; // นำเข้าตัวเกมหลัก

const GamePage = () => {
  useEffect(() => {
    // การตั้งค่าและการเริ่มต้นของ Phaser เมื่อ component ถูก mount
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [GameScene], // เพิ่มฉากที่ต้องการให้ Phaser ใช้
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
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

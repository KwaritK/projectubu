"use client";
import { useEffect } from 'react';
import Phaser from 'phaser';
import gAme from '/src/app/gametest/src/scene/game.js';



export default function Gameroom() {
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 1334,
            height: 650,
            parent:'gameBox', // ตรวจสอบให้ตรงกับ id ของ div
            
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH 
            },
            scene: [HomePage, GamePage, GameOverPage],
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: true
                }
            }
        };
        
        const game = new Phaser.Game(config);
  
    }
      
);
  
   // return <div id="gamebox" style={{ width: '1334px', height: '650px' }} />; // ให้ id ตรงกับ parent ใน config
}

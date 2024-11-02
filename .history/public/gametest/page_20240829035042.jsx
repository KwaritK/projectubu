"use client";
import { useEffect } from 'react';
import Phaser from 'phaser';
import gAme from '../../../public/gametest/src/scene/game.js';

export default function Gameroom() {
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
            scene: [gAme],
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: true
                }
            },
            baseURL: '/gametest/' // เพิ่มบรรทัดนี้
        };
        
        const game = new Phaser.Game(config);
    }, []);
  
    return <div id="gameBox"></div>;
}
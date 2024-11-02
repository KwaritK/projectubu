"use client";
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import gAme from '/src/app/gametest/src/scene/game.js';

export default function Gameroom() {
    const gameRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && !gameRef.current) {
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
                        gravity: { y: 0 },
                        debug: true
                    }
                }
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
        <div>
            <h1 id="gameTitle"> ANGRY สาวน้อยตกน้ำ</h1>
            <div id="gameContainer">
                <div id="gameBox" style={{ width: '800px', height: '600px' }}></div>
            </div>
        </div>
    );
}
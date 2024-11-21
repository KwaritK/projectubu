"use client";
import { useEffect } from 'react';




export default function Game() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js";
        script.onload = () => {
            const gameScript = document.createElement('script');
            gameScript.src = "../gametest/main.js";
            document.body.appendChild(gameScript);
        };
        document.body.appendChild(script);
    }, []);

    return (
        <div id="gameBox" style={{ width: '100%', height: '100vh' }}>
            {/* This div will contain the Phaser game */}
        </div>
    );
};

export default GameRoom;
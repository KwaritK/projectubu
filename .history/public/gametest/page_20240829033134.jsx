"use client";
import { useEffect } from 'react';
import HomePage from './scenes/HomePage.js';




const Game = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "/gametest/main.js";
        script.onload = () => {
            const gameScript = document.createElement('script');
            gameScript.src = "/gametest/main.js";
            document.body.appendChild(gameScript);
        };
        document.body.appendChild(script);
    }, []);

    return (
        <div id="gameContainer" style={{ width: '100%', height: '100vh' }}>
            {/* This div will contain the Phaser game */}
        </div>
    );
};

export default Game;
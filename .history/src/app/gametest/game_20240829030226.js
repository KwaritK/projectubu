"use client";
import { useEffect } from 'react';
import Phaser from 'phaser';
import game from './src/scene/gametest.js';





export default function Game() {
    useEffect(() => {
            var config = {
                type: Phaser.AUTO,
                width: 800,
                height: 600,
                parent:'gameContainer',
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH 
                },
                scene: {
                    preload: preload,
                    create: create,
                    update: update
                },
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 0 },
                        debug: true
                    }
                }
                var scene,

               
    
                
            };
            var game = new Phaser.Game(config);
        }
    
}


            

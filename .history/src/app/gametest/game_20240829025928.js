
"use client";
import { useEffect } from 'react';
import Phaser from 'phaser';



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
                var scene;

                function preload ()
                {
                    scene = this;
                    this.load.image('play','./assets/player.png')
                }
    
                function create ()
                {
                    player = scene.add.sprite(config.width/2,config.height/2,'player');
                }
    
                function update ()
                {
                    player.rotation+=0.05;
                }
    
                
            };
            var game = new Phaser.Game(config);
        }
    );
    


            
import Phaser from 'phaser';
import HomePage from './scenes/home.js';
import Game from './scenes/game.js';
import GameOverPage from './scenes/overpage.js';

const config = {
    type: Phaser.AUTO,
    width: 1334,
    height: 650,
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


const game = new Phaser.Game(config);




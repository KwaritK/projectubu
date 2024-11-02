import HomePage from './scenes/HomePage.js';
import GamePage from './scenes/GamePage.js';
import GameOverPage from './scenes/GameOverPage.js';

const config = {
    type: Phaser.AUTO,
    width: 1334,
    height: 650,
    parent: 'gameBox',
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

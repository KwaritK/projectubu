import HomePage from '/src/app/gameroom/src/scenes/HomePage.js';
import GamePage from '/src/app/gameroom/src/scenes/GamePage.js';
import GameOverPage from '/src/app/gameroom/src/scenes/GameOverPage.js';

const config = {
    type: Phaser.AUTO,
    width: 1334,
    height: 650,
    parent: 'gameBox', // ตรวจสอบว่า id ตรงกับ div ใน HTML
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

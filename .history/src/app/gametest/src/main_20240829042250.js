
import gAme from '/src/app/gametest/src/scene/game.js';


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'gameBox', // ตรวจสอบว่า id ตรงกับ div ใน HTML
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

const game = new Phaser.Game(config);




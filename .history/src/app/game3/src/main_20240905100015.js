import Phaser from 'phaser';
import HomePage from './scenes/home.js';
import Game from './scenes/game.js';
import GameOverPage from './scenes/overpage.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    if (!window.game) {
        window.game = new Phaser.Game(config); // สร้างเกมใหม่เมื่อ component ถูก mount
      }
  
      // ทำลายเกมเมื่อ component ถูก unmount เพื่อให้ไม่มีปัญหาเกมซ้ำกัน
      return () => {
        if (window.game) {
          window.game.destroy(true);
          window.game = null;
        }
      };
    }, []);
};


const game = new Phaser.Game(config);




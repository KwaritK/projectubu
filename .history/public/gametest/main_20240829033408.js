
import gAme from './src/scene/gametest.js';


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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



export default function Game() {
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent:'gameContainer', // ตรวจสอบให้ตรงกับ id ของ div
            
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
  
    }
      
);
  
   // return <div id="gamebox" style={{ width: '1334px', height: '650px' }} />; // ให้ id ตรงกับ parent ใน config
}

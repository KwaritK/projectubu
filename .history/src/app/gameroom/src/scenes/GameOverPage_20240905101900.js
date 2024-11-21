export default class GameOverPage extends Phaser.Scene {
    constructor() {
        super('GameOverPage');
    }

    preload() {
        this.load.image('button1', '/asset/imageG/rebut.png'); // Adjust the path if needed
        this.load.image('ovback', '/assets/imageG/ove.png'); // Load your background image
        
    }

    create(data) { // รับ data เป็นพารามิเตอร์
        // Add the background image
        let background = this.add.image(0, 0, 'ovback').setOrigin(0, 0);
        background.displayWidth = this.sys.game.config.width;
        background.displayHeight = this.sys.game.config.height;

       
        this.add.text(700, 50, 'Game Over', { fontSize: '105px', fill: '#000' }).setOrigin(0.5);
        

        const restartButton = this.add.sprite(650, 550, 'button1').setInteractive();

        restartButton.on('pointerover', () => {
            restartButton.setTint(0x0000ff);
        });

        restartButton.on('pointerout', () => {
            restartButton.clearTint();
        });

        restartButton.on('pointerdown', () => {
            this.scene.start('HomePage');
        });

        //แสดงคะแนน
        this.add.text(700, 150, 'Score: ' + data.score, { fontSize: '64px', fill: '#000' }).setOrigin(0.5); // แสดงคะแนน
    }
    
}

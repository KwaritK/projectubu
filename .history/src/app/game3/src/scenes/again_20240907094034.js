export default class AgainPage extends Phaser.Scene {
    constructor() {
        super('GameOverPage');
    }

    preload() {
        this.load.image('butstart', '/asset/imageR/butstart.png'); // Adjust the path if needed
        this.load.image('end', '/asset/imageR/end.png'); // Load your background image
        
    }
    init(data) {
        this.score = data.score;
    }

    create() { // รับ data เป็นพารามิเตอร์
        // Add the background image
        let background = this.add.image(0, 0, 'end').setOrigin(0, 0);
        background.displayWidth = this.sys.game.config.width;
        background.displayHeight = this.sys.game.config.height;

       
        this.add.text(400, 300, 'Game Over', { fontSize: '48px', fill: '#000' }).setOrigin(0.5);
        this.add.text(400, 350, 'Score: ' + this.score, { fontSize: '32px', fill: '#000' }).setOrigin(0.5);
        

        const restartButton = this.add.sprite(400, 500, 'butstart').setInteractive();
        restartButton.setScale(0.5);
        

        restartButton.on('pointerover', () => {
            restartButton.setTint(0xff0000);
        });

        restartButton.on('pointerout', () => {
            restartButton.clearTint();
        });

        restartButton.on('pointerdown', () => {
            this.scene.start('HomePage');
        });

       
    }
    
}
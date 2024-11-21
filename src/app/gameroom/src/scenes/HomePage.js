
export default class HomePage extends Phaser.Scene {
    constructor() {
        super('HomePage');
    }

    preload() {
        
        this.load.image('button', '/asset/imageG/butgame.png'); // Adjust the path if needed
        this.load.image('main', '/asset/imageG/one.png');
    }

    create() {
        this.add.image(0, 0, 'main').setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); 
        

        const startButton = this.add.sprite(700, 380, 'button').setInteractive();

        startButton.on('pointerover', () => {
            startButton.setTint(0x0000ff);
        });

        startButton.on('pointerout', () => {
            startButton.clearTint();
        });

        startButton.on('pointerdown', () => {
            this.scene.start('GamePage');
        });
    }
}

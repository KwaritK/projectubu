import Phaser from "phaser";
export default class HomePage extends Phaser.Scene {
    constructor() {
        super('HomePage');
    }

    preload() {
        this.load.image('but', '/asset/imageR/but.png'); // Adjust the path if needed
        this.load.image('main','/asset/imageR//main.png');
    }

    create() {
        this.add.image(0, 0, 'main').setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); 
        

        const startButton = this.add.sprite(350, 500, 'but').setInteractive();
        startButton.setScale(0.5);

        startButton.on('pointerover', () => {
            startButton.setTint(0xffffff);
        });

        startButton.on('pointerout', () => {
            startButton.clearTint();
        });

        startButton.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}

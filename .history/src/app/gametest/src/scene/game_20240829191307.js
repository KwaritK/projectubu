export default class gAme extends Phaser.Scene {
    constructor() {
        super('gAme');
    }

    preload() {
        
        this.load.image('button', '/asset/images/butgame.png'); // Adjust the path if needed
        this.load.image('main', '/assets/images/name');
    }

    create() {
        this.add.image(0, 0, 'main').setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); 
        

        const startButton = this.add.sprite(700, 550, 'button').setInteractive();

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
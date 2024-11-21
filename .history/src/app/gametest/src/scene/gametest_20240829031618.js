

export default class gAme extends Phaser.Scene {
    constructor() {
        super('gAme');

    }

    preload() {
        this.load.image('play','./assets/player.png')

    }

    create() {
        this.createPlayer();
        
      
    update () {
        
    }
    createPlayer() {
        this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'player');
        this.player.speed = 400;
        this.player.setScale(0.6);
        this.player.setSize(this.player.width * 0.5, this.player.height * 0.5);
        this.player.immortal = false;
    }

}
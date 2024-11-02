export default class gAme extends Phaser.Scene {
    constructor() {
        super('gAme');
    }

    preload() {
        
        this.load.image('playyer', '/asset/images/player.png');
        this.load.image('black', '/asset/images/player.png');
    }

    create() {
        this.createPlayer();
    }   
      
    update() {
        
    }
    
    createPlayer() {
        console.log("create");
        this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'player');
    }
}
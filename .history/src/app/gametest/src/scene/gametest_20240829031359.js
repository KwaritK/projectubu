

export default class gAme extends Phaser.Scene {
    constructor() {
        super('gAme');

    }

    preload() {
        this.load.image('play','./assets/player.png')

    }

    create() {
        player = this.add.sprite(pl.width/2,config.height/2,'player');
}
      
    update () {
        player.rotation+=0.05;
    }

}
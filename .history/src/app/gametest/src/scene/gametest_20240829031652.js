

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
    

}
}
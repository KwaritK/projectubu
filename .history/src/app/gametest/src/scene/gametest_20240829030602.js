function preload ()
{
    scene = this;
    this.load.image('play','./assets/player.png')
}

function create ()
{
    player = scene.add.sprite(config.width/2,config.height/2,'player');
}

function update ()
{
    player.rotation+=0.05;
}


export default class gAme extends Phaser.Scene {
    constructor() {
        super('gAme');
  
    }

    preload() {
        this.load.image('play','./assets/player.png')

    }

    create() {
        player = this.add.sprite(config.width/2,config.height/2,'player');
}
      
update ()
{
    player.rotation+=0.05;
}
}
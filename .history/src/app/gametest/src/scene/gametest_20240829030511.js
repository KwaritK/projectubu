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
        this.load.image('ball', './assets/fire.png');
        this.load.image('bigboy', './assets/bigboy.png');
        this.load.image('effect1', './assets/effect1.png');
        this.load.image('effect2', './assets/effect2.png');
        this.load.image('money', './assets/money.png');
        this.load.image('Heart', './assets/Heart.png');
        this.load.image('background1', './assets/background1.png');
        
        
    }

    create() {
       
        this.background1 = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'background1').setOrigin(0, 0);
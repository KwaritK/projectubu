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
        

        this.player = null;
        this.keyup = null;
        this.keydown = null;
        this.keyleft = null;
        this.keyright = null;
        this.keyfire = null;

        this.fireSpeed = 1000;
        this.playerFireGroup = null;

        this.moneySpeed = 400;
        this.bigboyGroup = null;
        this.bigboySpacing = 110;

        this.effectGroup = null;

        this.moneyGroup = null;

        this.playerHeart = 3;
        this.heartGroup = null;
        this.gameOver = false; // เพิ่มการกำหนดค่า gameOver
        
        
    }

    preload() {
        this.load.image('girl', './assets/girl.png');
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
export default class gAme extends Phaser.Scene {
    constructor() {
        super('gAme');
    }

    preload() {
        
        this.load.image('player', '/asset/images/player.png');
        this.load.image('black', '/asset/images/name.png');
    }

    create() {
        this.createPlayer();
        this.background = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'black').setOrigin(0, 0);
        console.log("createback");
    }   
      
    update() {
        this.background.tilePositionX += 9; // ปรับความเร็วการเลื่อนตามที่ต้องการ
        
    }
    
    createPlayer() {
        console.log("create");
        this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'player');
        this.player.depth()
    }
}
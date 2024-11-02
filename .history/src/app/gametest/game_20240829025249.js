var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent:'gameContainer',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH 
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }
};


var game = new Phaser.Game(config);
var sce

function preload ()
{
    this.load.image('play','./assets/player.png')
}

function create ()
{
}

function update ()
{
}
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent:'gameContainer',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load
}

function create ()
{
}

function update ()
{
}
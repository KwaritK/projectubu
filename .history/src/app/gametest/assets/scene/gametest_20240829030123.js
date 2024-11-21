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
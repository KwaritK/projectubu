export default class GamePage extends Phaser.Scene {
    constructor() {
        super('GamePage');
        this.score = 0;

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
        this.load.image('girl', '/assets/images/player.png');
        this.load.image('ball', '/assets/imageG/fire.png');
        this.load.image('bigboy', '/assets/imageG/bigboy.png');
        this.load.image('effect1', '/assets/imageG/effect1.png');
        this.load.image('effect2', '/assets/imageG/effect2.png');
        this.load.image('money', '/assets/imageG/money.png');
        this.load.image('Heart', '/assets/imageG/Heart.png');
        this.load.image('background1', '/asset/imageG/background1.png');
        
        
    }

    create() {
       
        this.background1 = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'background1').setOrigin(0, 0);
        
        this.createPlayer();
        this.playerFireGroup = this.add.group();
        this.effectGroup = this.add.group();

        this.playerHeart = 3;
        this.heartGroup = this.add.group();
        this.createPlayerheart();

        this.bigboyGroup = this.add.group();
        this.createBIGBOY();
        this.moneyGroup = this.add.group();

        // Create input keys
        this.keyup = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keydown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyleft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyright = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyfire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Collision detection
        this.physics.add.overlap(this.bigboyGroup, this.playerFireGroup, this.onBIGBOYhit, null, this);
        this.physics.add.overlap(this.player, this.moneyGroup, this.onPlayerHit, null, this);
        this.physics.add.overlap(this.player, this.bigboyGroup, this.onPlayerHit, null, this);
    
        this.score = 0;
        this.scoreText = this.add.text(1000,20, 'Score:0',{ fontSize:'68px',fill: '#000000',});
        
        
    }

    update() {
        // อัพเดตการเลื่อนพื้นหลัง
        this.background1.tilePositionX += 9; // ปรับความเร็วการเลื่อนตามที่ต้องการ
        
        
        
        
        
        if (!this.gameOver) {
            this.updatePlayer();
            this.updatePlayerFire();
            this.updateBIGBOY();
            this.updateeffect();
            this.updatebigboybullets();
        }
    }
    createPlayer() {
        console.log("create");
        this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'girl');
        this.player.speed = 400;
        this.player.setDepth
        this.player.setScale(0.6);
        this.player.setSize(this.player.width * 0.5, this.player.height * 0.5);
        this.player.immortal = false;
    }

    createPlayerheart() {
        for (let i = 0; i < this.playerHeart; i++) {
            const heart = this.add.sprite(40 + (i * 70), 40, 'Heart');
            heart.setScale(0.25);
            heart.depth = 10;
            this.heartGroup.add(heart);
        }
    }

    createBIGBOY() {
        for (let i = 0; i < 5; i++) {
            const bigboy = this.physics.add.sprite(1400, 100 + (i * this.bigboySpacing), "bigboy");
            bigboy.setScale(0.6);
            bigboy.setSize(bigboy.width * 0.5, bigboy.height * 0.5);
            bigboy.speed = (Math.random() * 2) + 1;
            bigboy.startX = this.scale.width + (bigboy.width / 2);
            bigboy.startY = 100 + (i * this.bigboySpacing);
            bigboy.x = bigboy.startX;
            bigboy.y = bigboy.startY;
            bigboy.magnitude = Math.random() * 40;

            bigboy.fireInterval = (Math.random() * 3000) + 1500;
            bigboy.fireTimer = this.time.addEvent({
                delay: bigboy.fireInterval,
                args: [bigboy],
                callback: this.bigboyFire,
                callbackScope: this,
                repeat: -1
            });

            this.bigboyGroup.add(bigboy);
        }
    }

    updatePlayer() {
        if (this.keyup.isDown) {
            this.player.setVelocityY(-this.player.speed);
        } else if (this.keydown.isDown) {
            this.player.setVelocityY(this.player.speed);
        } else {
            this.player.setVelocityY(0);
        }

        if (this.keyleft.isDown) {
            this.player.setVelocityX(-this.player.speed);
        } else if (this.keyright.isDown) {
            this.player.setVelocityX(this.player.speed);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.player.y < 0 + (this.player.getBounds().height / 2)) {
            this.player.y = (this.player.getBounds().height / 2);
        } else if (this.player.y > this.scale.height - (this.player.getBounds().height / 2)) {
            this.player.y = this.scale.height - (this.player.getBounds().height / 2);
        }

        if (this.player.x < 0 + (this.player.getBounds().width / 4)) {
            this.player.x = (this.player.getBounds().width / 4);
        } else if (this.player.x > this.scale.width - (this.player.getBounds().width / 4)) {
            this.player.x = this.scale.width - (this.player.getBounds().width / 4);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyfire)) {
            this.fire();
        }
    }

    updatePlayerFire() {
        this.playerFireGroup.getChildren().forEach(fire => {
            if (fire.x > this.scale.width) {
                fire.destroy();
            }
        });
    }

    updateBIGBOY() {
        this.bigboyGroup.getChildren().forEach(enemy => {
            enemy.x -= enemy.speed;
            enemy.y = enemy.startY + (Math.sin(this.game.getTime() / 1000) * enemy.magnitude);

            if (enemy.x < 0 - (enemy.width / 2)) {
                enemy.speed = (Math.random() * 2.5) + 1;
                enemy.x = enemy.startX;
                enemy.magnitude = Math.random() * 60;
            }
        });
    }

    updateeffect() {
        for (let i = this.effectGroup.getChildren().length - 1; i >= 0; i--) {
            const effect = this.effectGroup.getChildren()[i];
            effect.rotation += 0.04;
            effect.scale += 0.005;
            effect.alpha -= 0.05;

            if (effect.alpha <= 0) {
                effect.destroy();
            }
        }
    }

    updatebigboybullets() {
        for (let i = 0; i < this.moneyGroup.getChildren().length; i++) {
            const bullet = this.moneyGroup.getChildren()[i];

            if (bullet.x < 0 - (bullet.width / 2)) {
                bullet.destroy();
            }
        }
    }

    fire() {
        const fire = this.physics.add.sprite(this.player.x + 90, this.player.y - 10, "ball");
        fire.body.velocity.x = this.fireSpeed;
        fire.body.setSize(fire.displayWidth * 0.1, fire.displayHeight * 0.2);
        fire.body.setOffset((fire.displayWidth - fire.body.width) / 2, (fire.displayHeight - fire.body.height) / 2);
        this.playerFireGroup.add(fire);
    }

    onBIGBOYhit(bigboy, fire) {
        this.createeffect(bigboy.x, bigboy.y);
        fire.destroy();
        bigboy.x = bigboy.startX;
        bigboy.speed = (Math.random() * 2) + 1

        this.score += 1;
        this.scoreText.setText('Score:' + this.score)
    }

    createeffect(posX, posY) {
        const effect1 = this.add.sprite(posX, posY, 'effect1');
        effect1.setScale(0.3);
        effect1.rotation = Phaser.Math.Between(0, 360);

        const effect2 = this.add.sprite(posX, posY, 'effect2');
        effect2.setScale(0.3);
        effect2.rotation = Phaser.Math.Between(0, 360);

        this.effectGroup.add(effect1);
        this.effectGroup.add(effect2);
    }

    bigboyFire(enemy) {
        const bullet = this.physics.add.sprite(enemy.x, enemy.y, 'money');
        bullet.setScale(0.2);
        bullet.setSize(bullet.width * 0.5, bullet.height * 0.5);
        bullet.body.velocity.x = -this.moneySpeed;

        this.moneyGroup.add(bullet);
    }

    onPlayerHit(player, object) {
        if (!player.immortal) {
            if (object.texture.key === "money") {
                object.destroy();
            }

            this.playerHeart--;
            if (this.playerHeart <= 0) {
                this.playerHeart = 0;
                console.log("Game Over");
                
                this.scene.start('GameOverPage', { score: this.score }); // ส่งคะแนนไปยัง GameOverPage
            }

            this.updatePlayerHeart();
            player.immortal = true;
            player.flickerTimer = this.time.addEvent({
                delay: 100,
                callback: this.playFlickering,
                callbackScope: this,
                repeat: 15
            });
        }
    }

    playFlickering() {
        this.player.setVisible(!this.player.visible);

        if (this.player.flickerTimer.repeatCount === 0) {
            this.player.immortal = false;
            this.player.setVisible(true);
            this.player.flickerTimer.remove();
        }
    }

    updatePlayerHeart() {
        for (let i = this.heartGroup.getChildren().length - 1; i >= 0; i--) {
            if (this.playerHeart < i + 1) {
                this.heartGroup.getChildren()[i].setVisible(false);
            } else {
                this.heartGroup.getChildren()[i].setVisible(true);
            }
        }
    }
    
    
    
}

export default class Game extends Phaser.Scene {
  constructor() {
      super({ key: 'Game' });
      this.jumpCount = 0;
      this.maxJumps = 2;  // กำหนดจำนวนการกระโดดสูงสุดเป็น 2
      this.isOnGround = true;
      this.isDucking = false;
      this.collisionCount = 0;
      this.immortal = false;
      this.immortalTime = 1500;
      this.lastCollisionTime = 0;
      this.obstacleSpeed = 350; // ความเร็วเริ่มต้นของสิ่งกีดขวาง
      this.speedIncreaseInterval = 10000; // 20 วินาที
      this.speedIncreaseAmount = 50; // เพิ่มความเร็วครั้งละ 500
      this.gameTime = 0; // เวลาที่ผ่านไปในเกม
      this.gameOver = false; // เพิ่มการกำหนดค่า gameOver
      this.score = 0;
      this.scoreText;
      
    
      
  }

  preload() {
      this.load.image('player', '/asset/imageR/run0.0.png');
      this.load.image('ground', '/asset/imageR/ground.png');
      this.load.image('back', '/asset/imageR/background.png');
      this.load.image('enemy', 'assets/enemy3.png');
      this.load.image('ob1', 'assets/ob1.png');
      this.load.image('ob2', 'assets/obstacle.png');
      this.load.image('ob3', 'assets/ob2.png');
      this.load.image('heart', 'assets/heart.png');
      this.load.atlas('run','assets/run.png','assets/run.json')

  }

  create() {
    this.score=0;
    this.player = this.physics.add.sprite(250, 450, 'run');
    
    this.hearts = this.add.group({
      key: 'heart',
      repeat: 2,
      setXY: { x: 50, y: 50, stepX: 60 }
  });
  this.hearts.children.entries.forEach(heart => {
      heart.setScale(0.25);
      heart.setDepth(10);
  });

  let scoreBackground = this.add.rectangle(700, 50, 150, 40, 0x000000, 0.5);
this.scoreText = this.add.text(700, 50, 'Score: 0', { fontSize: '24px', fill: '#ffffff' });
this.scoreText.setOrigin(0.5);
scoreBackground.setDepth(9);
this.scoreText.setDepth(10);
    

      this.back = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'back').setOrigin(0, 0);
      this.ground = this.add.tileSprite(400, 600, 800, 200, 'ground');
      this.anims.create({
        key: 'run',
        frames: [{
          key: 'run',
          frame:'run0.1.png'
        },{
          key: 'run',
          frame:'run0.3.png'
        },{
          key: 'run',
          frame:'run0.2.png'
        },{
          key: 'run',
          frame:'run0.0.png'
        }],
        frameRate: 8,
        repeat: -1
      });
      this.player.play('run')

      // Enable physics on the ground
      this.physics.add.existing(this.ground, true);
      //console.log("Background depth:", this.back.depth);
      //console.log("Ground depth:", this.ground.depth);
      //console.log("Player depth:", this.player.depth);
      

      this.enemy = this.physics.add.sprite(250, 450, 'enemy');
      this.enemy.setCollideWorldBounds(true);
      this.enemy.y = this.ground.y - this.enemy.height / 2;
      this.enemy.setScale(0.9);
      this.enemy.setSize(this.enemy.width * 0.2, this.enemy.height * 0.4);
      this.enemy.x = this.player.x - 1200;
      this.enemy.body.setAllowGravity(false);

      this.enemy.setDepth(2);
      this.back.setDepth(0);
      this.ground.setDepth(0);
      this.player.setDepth(2);

      this.player.setScale(0.6);
      this.player.setCollideWorldBounds(true);
      this.player.setGravityY(2000);
      this.player.setSize(this.player.width * 0.2, this.player.height * 0.2 );
      
      
      //console.log("Player position:", this.player.x, this.player.y);
     
      //console.log("Current frame:", this.player.frame.name);

      
       // ตั้งค่าตำแหน่งเริ่มต้นของผู้เล่นให้อยู่บนพื้น
        this.player.y = this.ground.y - this.ground.height / 2 - this.player.displayHeight / 2;

      this.physics.add.collider(this.player, this.ground, () => {
          this.isOnGround = true;
          this.jumpCount = 0;
      });
      
      this.ob1= this.physics.add.group();
      this.ob2= this.physics.add.group();
      this.ob3= this.physics.add.group();

      this.physics.add.collider(this.player, this.ground);
      this.physics.add.collider(this.enemy, this.ground);
      this.physics.add.overlap(this.player, this.ob1, this.hitObstacle, null, this);
      this.physics.add.overlap(this.player,  this.ob2, this.hitObstacle, null, this);
      this.physics.add.overlap(this.player,  this.ob3, this.hitObstacle, null, this);


      this.time.addEvent({
          delay: 1000,  // เรียกทุก 1 วินาที
          callback: this.createRandomObstacle,
          callbackScope: this,
          loop: true

        });
        this.time.addEvent({
          delay: this.speedIncreaseInterval,
          callback: this.increaseObstacleSpeed,
          callbackScope: this,
          loop: true
      });
  
      // Timer สำหรับนับเวลาเกม
      this.time.addEvent({
          delay: 1000,
          callback: () => { this.gameTime += 1000; },
          callbackScope: this,
          loop: true
      });

        

        this.lastObstacleTime = 0;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-DOWN', this.duck, this);
        this.input.keyboard.on('keydown-UP', this.jump, this);
        
          // เพิ่มตัวแปรเพื่อเก็บเวลาที่สิ่งกีดขวางถูกสร้างล่าสุด
         this.lastObstacleTime = 0;
         this.resetGame();
        
      
  }

  increaseObstacleSpeed() {
    this.obstacleSpeed += this.speedIncreaseAmount;
    console.log(`Obstacle speed increased to ${this.obstacleSpeed}`);
}
  resetGame() {
    this.score = 0;
    this.scoreText.setText('Score: 0');
    this.collisionCount = 0;
    this.lastCollisionTime = 0;
    this.player.setAlpha(1);
    this.player.clearTint();
    this.obstacleSpeed = 350; // รีเซ็ตความเร็วเริ่มต้น
    this.gameTime = 0; // รีเซ็ตเวลาเกม
}
  update(time,delta) {
    this.score += delta * 10;

    this.score += this.obstacleSpeed * (delta / 1000);
    this.scoreText.setText('Score: ' + Math.floor(this.score));
    let currentScore = Math.floor(this.score / 1000);
    this.scoreText.setText('Score: ' + currentScore);
    //console.log('Current Score:', currentScore);

      this.back.tilePositionX += 9; // Adjust the scrolling speed as needed
      this.ground.tilePositionX += 9;

      this.ob1.children.entries.forEach(ob => ob.setVelocityX(-this.obstacleSpeed));
      this.ob2.children.entries.forEach(ob => ob.setVelocityX(-this.obstacleSpeed));
      this.ob3.children.entries.forEach(ob => ob.setVelocityX(-this.obstacleSpeed));

      // ตรวจสอบการชนกับพื้น
  if (this.player.body.touching.down) {
    this.isOnGround = true;
    this.jumpCount = 0;
    
    
   }

      this.ob1.children.entries.forEach(ob1 => {
          if (ob1.x < -ob1.width) {
            ob1.destroy();
            //console.log("delete1");
            
          }
        });
        this.ob2.children.entries.forEach(ob2 => {
          if (ob2.x < -ob2.width) {
            ob2.destroy();
            
          }
        });this.ob3.children.entries.forEach(ob3 => {
          if (ob3.x < -ob3.width) {
            ob3.destroy();
            
          }
        });

        if (this.cursors.down.isDown) {
          if (!this.isDucking) {
              this.duck();
          }
      } else {
          if (this.isDucking) {
              this.standUp();
          }
      }
  
      // ตรวจสอบการชนกับพื้นเฉพาะเมื่อไม่ได้หมอบ
      if (!this.isDucking) {
          if (this.player.body.touching.down) {
              this.isOnGround = true;
              this.jumpCount = 0;
          } } else {
          // เมื่อหมอบ ให้ถือว่าอยู่บนพื้นเสมอ
          this.isOnGround = true;
          this.jumpCount = 0;
      }

       

      }



jump() {
        if (this.isOnGround || this.jumpCount < this.maxJumps) {
            this.player.setVelocityY(-740);  // แรงกระโดด
            this.jumpCount++;
            this.isOnGround = false;
           // console.log("jump :", this.jumpCount);
        }
}

duck() {
      if (!this.isDucking) {
          this.isDucking = true;
          this.player.setScale(0.6, 0.3); // ปรับให้เตี้ยลง
          //this.player.setOffset(0, this.player.height * 0.5); // ปรับ offset เพื่อให้ collider อยู่ที่ฐานของตัวละคร
      
      // เพิ่มบรรทัดนี้เพื่อรักษาตำแหน่ง Y ของตัวละครเมื่อหมอบบนพื้น
      if (this.isOnGround) {
          this.player.y = this.ground.y - this.ground.height / 2 - this.player.displayHeight / 2;
      }
          
      }
  }
  
standUp() {
      if (this.isDucking) {
          this.isDucking = false;
          this.player.setScale(0.6); // กลับสู่ขนาดปกติ
          
      
          // เพิ่มบรรทัดนี้เพื่อปรับตำแหน่ง Y ของตัวละครเมื่อยืนขึ้น
          if (this.isOnGround) {
              this.player.y = this.ground.y  - this.player.displayHeight / 2;
          }
          
      }
  }

      createRandomObstacle() {
       
          const currentTime = this.time.now;
          const minTimeBetweenObstacles = 1400;  // 1.4 วินาที
        
          if (currentTime - this.lastObstacleTime < minTimeBetweenObstacles) {
            return;
          }
        
          const x = 500;  // ตำแหน่ง X ที่จะสร้างสิ่งกีดขวาง
          let y;
        
          const randomNum = Math.random();
if (randomNum < 0.33) {
  y = Phaser.Math.Between(500, 550);
  if (!this.isObstacleNearby(x, y)) {
    this.createob1();
  }
} 
else if (randomNum < 0.66) {
  y = Phaser.Math.Between(450, 500);
  if (!this.isObstacleNearby(x, y)) {
    this.createob2();
  }
}
else {
  y = Phaser.Math.Between(450, 500);
  if (!this.isObstacleNearby(x, y)) {
    this.createob3();
  }
}
this.lastObstacleTime = currentTime;
      }
      createob1() {
          const ob1 = this.ob1.create(800,  470, 'ob1');
          
          ob1.setScale(0.4);
          ob1.setSize(ob1.width * 0.3 , ob1.height * 0.4);
          ob1.body.setAllowGravity(false);
          ob1.setVelocityX(-this.obstacleSpeed);
          ob1.setCollideWorldBounds(false);
        }
        createob2() {
          const ob2 = this.ob2.create(800, 440, 'ob2');
          
          ob2.setScale(0.7);
          ob2.setSize(ob2.width * 0.3, ob2.height * 0.6);
          ob2.body.setAllowGravity(false);
          ob2.setVelocityX(-this.obstacleSpeed);
          ob2.setCollideWorldBounds(false);
        }
        createob3() {
          const ob3 = this.ob3.create(800, 420, 'ob3');
          
          ob3.setScale(0.8);
          ob3.setSize(ob3.width * 0.4, ob3.height * 0.2);
          ob3.body.setAllowGravity(false);
          ob3.setVelocityX(-this.obstacleSpeed);
          ob3.setCollideWorldBounds(false);
          
        }

        isObstacleNearby(x, y) {
          const nearbyDistance = 200;  // ระยะห่างขั้นต่ำระหว่างสิ่งกีดขวาง
          
          const checkGroup = (group) => {
            return group.getChildren().some(obstacle => 
              Math.abs(obstacle.x - x) < nearbyDistance && Math.abs(obstacle.y - y) < 100
            );
          };
        
          return checkGroup(this.ob1) || checkGroup(this.ob2)|| checkGroup(this.ob3) ;
      }

      hitObstacle(player) {
        const currentTime = this.time.now;
        if (!player.immortal && currentTime - this.lastCollisionTime >= this.immortalTime) {
          this.collisionCount++;
          this.lastCollisionTime = currentTime;
          this.blink();
          player.immortal = true;
          player.flickerTimer = this.time.addEvent({
            delay: 100,
            callback: this.playerBlink,
            callbackScope: this,
            repeat: 15
          });
    
          if (this.collisionCount >= 3) {
            this.endGame();
          }
        }
      }
    
      playerBlink() {
        this.player.setVisible(!this.player.visible);
        if (this.player.flickerTimer.repeatCount === 0) {
          this.player.immortal = false;
          this.player.setVisible(true);
          this.player.flickerTimer.remove();
        }
      }
    
      blink() {
        if (this.hearts.children.entries.length > 0) {
          this.hearts.children.entries[this.hearts.children.entries.length - 1].destroy();
        }
      }
    
      endGame() {
        console.log("Game Over");
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.time.delayedCall(1500, () => {
          this.scene.start('GameOverPage', { score: Math.floor(this.score / 1000) });
        });
      }}
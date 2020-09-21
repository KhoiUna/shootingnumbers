class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    this.load.image("sprite", "asset/sprite.png");
    this.load.image("platform", "asset/platform.png");
    this.load.image("enemy", "asset/enemy.png");
    this.load.image("shoot", "asset/shoot.png");
    let numArr = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    for (let i of numArr) {
      this.load.image(`${i}`, `asset/${i}.png`);
    }
  }

  create() {
    this.add.text(70, 250, "WELCOME", {
      fontFamily: "'Press Start 2P'",
      fontSize: "30px",
      fill: "#000000",
    });
    this.add.text(72, 320, "Click to play!", {
      fontFamily: "'Press Start 2P'",
      fontSize: "15px",
      fill: "#000000",
    });

    //Create platform
    gameState.platform = this.physics.add.staticGroup();
    gameState.platform.create(200, 600, "platform");

    //Create sprite
    gameState.sprite = this.physics.add
      .sprite(170, 450, "sprite")
      .setCollideWorldBounds(true);
    gameState.sprite.setScale(0.3);
    gameState.sprite.setVelocityX(300);
    gameState.sprite.setBounce(1);

    //Add collider
    this.physics.add.collider(gameState.sprite, gameState.platform);

    //Create enemy
    gameState.enemy = this.physics.add
      .sprite(160, 78, "enemy")
      .setCollideWorldBounds(true);
    gameState.enemy.setScale(0.3);
    gameState.enemy.setGravityY(-gameGravity);
    gameState.enemy.setVelocityX(150);
  }

  update() {
    //Move enemy back and forth
    if (gameState.enemy.x === 233.65) {
      gameState.enemy.setVelocityX(-150);
    } else if (gameState.enemy.x === 106.35) {
      gameState.enemy.setVelocityX(150);
    }

    //Click move to next scene
    this.input.on("pointerup", () => {
      this.scene.start("PlayScene");
    });
  }
}

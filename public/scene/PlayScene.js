//Declare game variables
let answer, bulletNum;
let initBulletNumArr = []; //initial bullet num array
let bulletNumArr = [];
let caughtNumArr = [];
let bulletShot = false;
let loopOnce = true;
let addScoreAnswer = true;
let minusScoreBulletHit = true;

//Show popup score-container
const scoreContainer = document.querySelector(".score-container");
const playerScore = document.querySelector("#player-score");
const showPopupScore = () => {
  scoreContainer.style.display = "block";
  if (gameState.score <= 0) {
    playerScore.style.color = "red";
  } else {
    playerScore.style.color = "#32CD32";
  }
  playerScore.innerHTML = gameState.score * 10;
};

class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayScene" });
  }
  //Helper Methods
  //Generate math questions method
  mathGen() {
    let firstNum = Math.floor(Math.random() * 100);
    let secondNum = Math.floor(Math.random() * 100);
    answer = (firstNum + secondNum).toString();
    return `${firstNum} + ${secondNum}`;
  }

  //Generate bullet method
  bulletGen() {
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    }
    //Add bullet function
    const addBullet = (number) => {
      gameState.bullet = this.physics.add
        .sprite(
          getRandomIntInclusive(gameState.enemy.x - 80, gameState.enemy.x + 90),
          158,
          `${number}`
        )
        .setScale(0.15)
        .setGravityY(-200);
      //Add collider between bullet and platform
      this.physics.add.collider(
        gameState.bullet,
        gameState.platform,
        (bullet) => {
          bullet.destroy();
          if (bulletNumArr[0] == answer[0] && gameState.active) {
            this.cameras.main.shake(100, 0.05, true);
            gameState.spriteHp.width -= 34.1;
            //reduce score when correct bullet hits platform
            if (minusScoreBulletHit) {
              gameState.score -= 5;
            }
          }
          bulletNumArr.shift();
        }
      );
      //Add collider between bullet and sprite
      this.physics.add.collider(
        gameState.bullet,
        gameState.sprite,
        (bullet) => {
          bullet.destroy();
          //Condition if sprite catches correct bomb and wrong bomb
          if (bulletNumArr[0] == answer[0]) {
            answer = answer.substring(1, answer.length); //remove first digit of the answer
            caughtNumArr.push(bulletNumArr[0]);
          } else if (gameState.active) {
            this.cameras.main.shake(100, 0.02, true);
            gameState.spriteHp.width -= 34.1;
            //reduce score when sprite is hit by wrong bullet
            if (minusScoreBulletHit) {
              gameState.score -= 5;
            }
          }
          bulletNumArr.shift();
        }
      );
    };

    //Condition to generate random bullet
    switch (getRandomIntInclusive(0, 9)) {
      case 0:
        addBullet("zero");
        bulletNum = 0;
        break;
      case 1:
        addBullet("one");
        bulletNum = 1;
        break;
      case 2:
        addBullet("two");
        bulletNum = 2;

        break;
      case 3:
        addBullet("three");
        bulletNum = 3;
        break;
      case 4:
        addBullet("four");
        bulletNum = 4;
        break;
      case 5:
        addBullet("five");
        bulletNum = 5;
        break;
      case 6:
        addBullet("six");
        bulletNum = 6;
        break;
      case 7:
        addBullet("seven");
        bulletNum = 7;
        break;
      case 8:
        addBullet("eight");
        bulletNum = 8;
        break;
      default:
        addBullet("nine");
        bulletNum = 9;
    }
  }

  //Shoot method
  shoot() {
    //Add shoot for sprite
    gameState.shoot = this.physics.add.sprite(
      gameState.sprite.x,
      gameState.sprite.y,
      "shoot"
    );

    //Add collider for shoot and enemy
    this.physics.add.collider(gameState.shoot, gameState.enemy, (shoot) => {
      shoot.destroy();
      gameState.enemyHp.width -= 22.73;
      if (gameState.active) {
        gameState.score += 20; //add score when shoot hits enemy
        this.cameras.main.shake(100, 0.05, true);
      }
    });

    //Add collider for shoot and bullet
    this.physics.add.collider(
      gameState.shoot,
      gameState.bullet,
      (shoot, bullet) => {
        bullet.destroy();
        shoot.destroy();
        if (gameState.bullet.y < 200) {
          bulletShot = true;
        }
        bulletNumArr.shift();
      }
    );

    gameState.shoot.setScale(0.12).setVelocityY(-400).setGravityY(-gameGravity);
    //Create new questions after shoot
    gameState.mathQuestion.setText(this.mathGen());
    gameState.mathQuestion.setColor("#000000");
    //Reset caughtNumArr after shooting
    caughtNumArr.length = 0;
    //Reset addScore to true
    addScoreAnswer = true;
  }

  //Phaser Methods
  create() {
    //Create cursor keys
    gameState.cursor = this.input.keyboard.createCursorKeys();

    //Create platform
    gameState.platform = this.physics.add.staticGroup();
    gameState.platform.create(200, 600, "platform");

    //Create sprite
    gameState.sprite = this.physics.add
      .sprite(170, 450, "sprite")
      .setCollideWorldBounds(true);
    gameState.sprite.setScale(0.3);
    //Create sprite's healthpoint bar
    gameState.spriteHp = this.add.rectangle(170, 610, 341, 20, 0x00ff00, 1);

    //Add collider between sprite and platform
    this.physics.add.collider(gameState.sprite, gameState.platform);

    //Create enemy
    gameState.enemy = this.physics.add
      .sprite(160, 78, "enemy")
      .setCollideWorldBounds(true);
    gameState.enemy.setScale(0.3);
    gameState.enemy.setGravityY(-gameGravity);
    //Create enemy's healthpoint bar
    gameState.enemyHp = this.add.rectangle(170, 5, 341, 20, 0xff0000, 1);
    gameState.enemy.setVelocityX(-150);

    //Create math question
    gameState.mathQuestion = this.add.text(93, 110, this.mathGen(), {
      fontFamily: "'Press Start 2P'",
      fontSize: "20px",
      fill: "#000000",
    });

    //Create caught numbers for displaying
    gameState.caughtNums = this.add.text(150, 550, caughtNumArr.join(""), {
      fontFamily: "'Press Start 2P'",
      fontSize: "24px",
      fill: "#0000FF",
    });

    //Generate bullet
    this.bulletGen();
    initBulletNumArr.push(bulletNum);
  }

  update() {
    //Move enemy back and forth
    if (gameState.enemy.x === 233.65) {
      gameState.enemy.setVelocityX(-150);
    } else if (gameState.enemy.x === 106.35) {
      gameState.enemy.setVelocityX(150);
    }
    gameState.mathQuestion.x = gameState.enemy.x - 67; //Keep math question go together with enemy

    //Only for gameState.active is true
    if (gameState.active) {
      //Condition to drop bullet when the bullet generated before has fallen below a certain height
      if (gameState.bullet.y >= 200) {
        if (!gameState.pushInitBulletNumArr) {
          bulletNumArr.push(initBulletNumArr[initBulletNumArr.length - 1]);
          gameState.pushInitBulletNumArr = true;
        }
        this.bulletGen();
        bulletNumArr.push(bulletNum);
      }
      //In case the bullet is hit by sprite's shoot, make enemy drop bullet again
      if (bulletShot) {
        gameState.bullet.y = 200;
        bulletShot = false;
      }

      //Condition to enable shoot
      if (answer.length === 0) {
        gameState.enableShoot = true;
        gameState.mathQuestion.setColor("#00FA9A"); //set question color to green when answer correctly
        //Condition to add score only once
        if (addScoreAnswer) {
          gameState.score += 10; //add score when answer correctly
          addScoreAnswer = false;
        }
      } else {
        gameState.enableShoot = false;
      }

      //Update caught numbers
      gameState.caughtNums.setText(caughtNumArr.join(""));

      //Control sprite for keyboards
      if (gameState.cursor.left.isDown) {
        gameState.sprite.setVelocityX(-300);
      } else if (gameState.cursor.right.isDown) {
        gameState.sprite.setVelocityX(300);
      } else {
        gameState.sprite.setVelocityX(0);
      }
      //Execute if the space key is pressed
      if (gameState.cursor.up.isDown && gameState.sprite.body.touching.down) {
        gameState.sprite.setVelocityY(-300);
      }
      if (
        Phaser.Input.Keyboard.JustDown(gameState.cursor.space) &&
        gameState.enableShoot
      ) {
        this.shoot();
      }
    }

    //Winning & losing condition
    if (gameState.spriteHp.width <= 3) {
      //Player loses
      this.bulletGen(); //drop bullet continuously
      this.add.text(60, 250, "GAME OVER!", {
        fontFamily: "'Press Start 2P'",
        fontSize: "28px",
        fill: "#7B68EE",
      });
      this.add.text(120, 320, "You lost!", {
        fontFamily: "'Press Start 2P'",
        fontSize: "15px",
        fill: "#7B68EE",
      });
      //Display score
      this.add.text(62, 350, `Your score: ${gameState.score * 10}`, {
        fontFamily: "'Press Start 2P'",
        fontSize: "16px",
        fill: "#7B68EE",
      });
      showPopupScore();
      gameState.sprite.x = 170;
      minusScoreBulletHit = false; //set to false to stop reducing score
      gameState.active = false; //gameState.active to false
    } else if (gameState.enemyHp.width <= 0.05) {
      //Player wins
      this.shoot(); //shoot continuously
      this.add.text(60, 250, "CONGRATS!", {
        fontFamily: "'Press Start 2P'",
        fontSize: "28px",
        fill: "#32CD32",
      });
      this.add.text(120, 320, "You won!", {
        fontFamily: "'Press Start 2P'",
        fontSize: "15px",
        fill: "#32CD32",
      });
      //Display score
      this.add.text(62, 350, `Your score: ${gameState.score * 10}`, {
        fontFamily: "'Press Start 2P'",
        fontSize: "16px",
        fill: "#32CD32",
      });
      showPopupScore();
      //Make sprite bounce and move
      if (loopOnce) {
        gameState.sprite.setBounce(1);
        gameState.sprite.setVelocityX(300);
        loopOnce = false;
      }
      if (gameState.sprite.x === 323.5) {
        gameState.sprite.setVelocityX(-300);
      } else if (gameState.sprite.x === 16.5) {
        gameState.sprite.setVelocityX(300);
      }
      gameState.active = false; //gameState.active to false
    }
  }
}

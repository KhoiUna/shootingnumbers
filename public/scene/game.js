const gameState = {
  active: true,
  pushInitBulletNumArr: false,
  enableShoot: false,
  score: 0,
};

//Game width & height
gameWidth = 340;
gameHeight = 620;
gameGravity = 400;
gameBackground = "#FFFFFF";

const config = {
  type: Phaser.AUTO,
  backgroundColor: gameBackground,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: gameGravity },
    },
  },
  scale: {
    parent: "gameDiv",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: gameWidth,
    height: gameHeight,
  },
  scene: [StartScene, PlayScene],
};
const game = new Phaser.Game(config);

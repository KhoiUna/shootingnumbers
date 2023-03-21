const tutorial = document.querySelector(".tutorial-container");
const gameWindow = document.querySelector("#gameDiv");
const instruction = document.querySelector("#instructions");
const insImg = document.querySelector("#insImg");
const skipButton = document.querySelector("#skip");
const nextButton = document.querySelector("#next");

//Declare instructions obj
const insObj = {
  one: {
    ins: "Your enemy shows you a math question and you have to calculate it in your head.",
    pic: "./img/insOne.png",
  },
  two: {
    ins: "Enemy will drop bullets. You have to catch the correct numbers from left to right and avoid the wrong ones (using ARROW keys to move and jump). Moreover, you cannot let the correct ones hit the ground, too.",
    pic: "./img/insTwo.png",
  },
  three: {
    ins: "After you catch all the correct numbers, you have a chance to shoot your enemy using SPACEBAR key. The numbers you've caught are shown below.",
    pic: "./img/insThree.png",
  },
  four: {
    ins: "The goal is to defeat your enemy and get the highest score.",
    pic: null,
  },
  five: {
    ins: "HAVE FUN!",
    pic: null,
  },
};

//Skip button event
skipButton.addEventListener("click", () => {
  tutorial.style.display = "none";
  gameWindow.style.visibility = "visible";
});

//Next button event
let insCounter = 0;
nextButton.addEventListener("click", () => {
  if (insCounter === 3) {
    insImg.style.display = "none";
    instruction.innerHTML = insObj[Object.keys(insObj)[insCounter]].ins;
  } else if (insCounter === 4) {
    insImg.style.display = "none";
    instruction.innerHTML = insObj[Object.keys(insObj)[insCounter]].ins;
  } else if (insCounter === 5) {
    tutorial.style.display = "none";
    gameWindow.style.visibility = "visible";
  } else {
    skipButton.style.display = "none";
    insImg.style.visibility = "visible";
    instruction.innerHTML = insObj[Object.keys(insObj)[insCounter]].ins;
    insImg.src = insObj[Object.keys(insObj)[insCounter]].pic;
  }
  insCounter++; //increment insCounter
});

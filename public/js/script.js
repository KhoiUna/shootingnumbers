const responseField = document.querySelector("#responseField");
const submitButton = document.querySelector("#submit");

function sendPlayerInfo() {
  const playerScore = document.getElementById("player-score").innerHTML;
  const playername = document.getElementById("playername").value;

  let xhr = new XMLHttpRequest();
  let url = "/leaderboard";
  let data = JSON.stringify({ score: playerScore, playername: playername });

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
    }
  };

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
}

const responseField = document.querySelector("#responseField");
const submitButton = document.querySelector("#submit");

function sendPlayerInfo(event) {
  event.preventDefault();

  const playerScore = document.getElementById("player-score").innerText || 0;
  const playername = document.getElementById("playername").value;

  const xhr = new XMLHttpRequest();
  const url = "/api/leaderboard";
  const data = JSON.stringify({ score: playerScore, playername: playername });

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      const response = JSON.parse(xhr.response);
      if (response.success) window.location.reload();
    }
  };

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
}

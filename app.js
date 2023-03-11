require("dotenv").config();

const { Pool } = require("pg");
const morgan = require("morgan");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 8000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
pool.connect();

app.use(express.json(), morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//Helper functions
const addToDb = (playername, score) => {
  const query = "INSERT INTO player_info(player, score) VALUES ($1, $2)";
  pool.query(query, [playername, score], (err) => {
    if (err) throw err;
    console.log("Add to database!");
  });
};

let playerData;
const getDb = (res) => {
  const query =
    "SELECT player, score FROM player_info ORDER BY score DESC LIMIT 3";
  pool.query(query, (err, result) => {
    if (err) throw err;
    playerData = result.rows;
    res.render("index.ejs", { playerData: playerData });
  });
};

//Routes
app.get("/", (req, res) => {
  setTimeout(() => {
    getDb(res);
  }, 200);
});

app.post("/leaderboard", (req, res) => {
  let playername = req.body.playername;
  let score = req.body.score;
  addToDb(playername, score);
});

app.use("/leaderboard/submit", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});

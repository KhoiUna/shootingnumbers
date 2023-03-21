require("dotenv").config();

const { Pool } = require("pg");
const morgan = require("morgan");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 8000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
pool.connect().catch((error) => console.error("Database connection failed!"));

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

const getDb = async () => {
  const { rows } = await pool.query(
    "SELECT player, score FROM player_info ORDER BY score DESC LIMIT 3"
  );
  return rows;
};

app.get("/", async (req, res) => {
  const playerData = await getDb();
  console.log(playerData);

  res.render("index.ejs", { playerData });
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

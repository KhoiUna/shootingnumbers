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
app.use(express.static("public"));
app.set("view engine", "ejs");

//Helper functions
const addToDb = async (playername, score) => {
  try {
    const response = await pool.query(
      "INSERT INTO player_info(player, score) VALUES ($1, $2)",
      [playername, score]
    );

    if (response) return true;

    return;
  } catch (error) {
    console.error("Error saving player");
    return;
  }
};

const getDb = async () => {
  const { rows } = await pool.query(
    "SELECT player, score FROM player_info ORDER BY score DESC LIMIT 3"
  );
  return rows;
};

app.get("/", async (req, res) => {
  const playerData = await getDb();
  return res.render("index.ejs", { playerData });
});

app.post("/api/leaderboard", async (req, res) => {
  const { playername, score } = req.body;

  if (await addToDb(playername, score))
    return res.json({
      success: true,
      error: false,
    });

  return res.json({
    success: false,
    error: true,
  });
});

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});

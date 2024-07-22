const express = require("express");
const {
  joinGame,
  makeMove,
  getGameStatus,
} = require("../controllers/game-controller");

const router = express.Router();

router.post("/join", joinGame);
router.post("/move", makeMove);
router.get("/status/:gameId", getGameStatus);

module.exports = router;

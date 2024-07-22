const Game = require("../models/game.schema");
const History = require("../models/history.schema");
const User = require("../models/user.schema");

const joinGame = async (req, res) => {
  try {
    const playerId = req.body.playerId;
    let game = await Game.findOne({ status: "ongoing" });

    if (!game) {
      game = new Game({ player1Id: playerId });
      console.log("Created new game with player1Id:", playerId);
    } else if (!game.player2Id) {
      game.player2Id = playerId;
      game.status = "ongoing";
      console.log("Joined game with player2Id:", playerId);
    } else {
      return res.status(400).json({ error: "Game is full" });
    }

    await game.save();

    // Update the user's game history
    let history = await History.findOne({ user: playerId });
    if (!history) {
      history = new History({ user: playerId, games: [game._id] });
    } else {
      history.games.push(game._id);
    }

    await history.save();
    await User.findByIdAndUpdate(playerId, {
      $addToSet: { gameHistory: history._id },
    });

    console.log("Game saved and history updated:", game, history);
    res.json(game);
  } catch (err) {
    console.error("Error in joinGame:", err);
    res.status(500).json({ error: err.message });
  }
};

const makeMove = async (req, res) => {
  try {
    const { gameId, row, col, playerId } = req.body;
    console.log(
      `makeMove called with gameId: ${gameId}, row: ${row}, col: ${col}, playerId: ${playerId}`
    );

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });

    if (game.board[row][col] === null && playerId === game.currentPlayer) {
      game.board[row][col] = game.currentPlayer;
      game.currentPlayer = game.currentPlayer === "R" ? "Y" : "R";

      const winner = calculateWinner(game.board);
      if (winner) {
        game.status = "finished";
        game.winner = winner;
        console.log("Game finished with winner:", winner);

        // Enregistrer l'historique des jeux
        const isPlayer1Winner =
          (winner === "R" && game.player1Id.toString() === playerId) ||
          (winner === "Y" && game.player2Id.toString() === playerId);
        const opponentId =
          game.player1Id.toString() === playerId
            ? game.player2Id.toString()
            : game.player1Id.toString();

        await addGameHistory(playerId, isPlayer1Winner, opponentId);
      } else if (game.board.flat().every(Boolean)) {
        game.status = "finished";
        game.winner = "draw";
        console.log("Game finished with a draw");
      }

      await game.save();
      console.log("Move saved:", game);
      res.json(game);
    } else {
      res.status(400).json({ error: "Invalid move" });
    }
  } catch (err) {
    console.error("Error in makeMove:", err);
    res.status(500).json({ error: err.message });
  }
};

const getGameStatus = async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    res.json(game);
  } catch (err) {
    console.error("Error in getGameStatus:", err);
    res.status(500).json({ error: err.message });
  }
};

const calculateWinner = (board) => {
  const rows = board.length;
  const cols = board[0].length;

  const directions = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
  ];

  const checkDirection = (row, col, dir) => {
    const player = board[row][col];
    if (!player) return null;

    for (let i = 1; i < 4; i++) {
      const newRow = row + dir.x * i;
      const newCol = col + dir.y * i;
      if (
        newRow < 0 ||
        newRow >= rows ||
        newCol < 0 ||
        newCol >= cols ||
        board[newRow][newCol] !== player
      ) {
        return null;
      }
    }
    return player;
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      for (let dir of directions) {
        const winner = checkDirection(row, col, dir);
        if (winner) return winner;
      }
    }
  }

  return null;
};

module.exports = {
  joinGame,
  makeMove,
  getGameStatus,
};

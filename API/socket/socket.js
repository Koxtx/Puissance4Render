const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const { log } = require("console");

const app = express();
const serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

let players = {};
let wins = {};
let board = Array(6)
  .fill(null)
  .map(() => Array(7).fill(null));
let currentPlayer = "R";

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("joinGame", ({ playerId, username }) => {
    if (Object.keys(players).length < 2) {
      players[socket.id] = {
        color: currentPlayer,
        username,
        wins: wins[username] || 0,
      };
      wins[username] = wins[username] || 0;
      currentPlayer = currentPlayer === "R" ? "Y" : "R";
      socket.emit("playerAssignment", players[socket.id].color);
      io.emit("updatePlayers", Object.values(players));
    } else {
      socket.emit("error", { message: "Game is full" });
    }

    io.emit("updateBoard", { board, currentPlayer });
  });

  socket.on("makeMove", ({ row, col, playerId }) => {
    console.log(`Move received: row ${row}, col ${col}, player ${playerId}`);
    if (isValidMove(row, col, socket)) {
      board[row][col] = players[socket.id].color;
      currentPlayer = currentPlayer === "R" ? "Y" : "R";
      io.emit("updateBoard", { board, currentPlayer });

      const winner = calculateWinner(board);
      if (winner) {
        const winnerPlayer = Object.values(players).find(
          (player) => player.color === winner
        );
        wins[winnerPlayer.username]++;
        io.emit("gameOver", { winner: winnerPlayer.username });
        io.emit("updatePlayers", Object.values(players));
        resetGame();
      } else if (board.flat().every(Boolean)) {
        io.emit("gameOver", { winner: "Draw" });
        resetGame();
      }
    } else {
      socket.emit("error", { message: "Invalid move" });
    }
  });

  socket.on("resetGameForPlayer", ({ playerColor }) => {
    socket.emit("gameResetForPlayer", {
      board: Array(6)
        .fill(null)
        .map(() => Array(7).fill(null)),
      currentPlayer: "R",
      playerColor: playerColor,
    });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    delete players[socket.id];
    if (Object.keys(players).length === 0) {
      resetGame();
    }
    io.emit("updateBoard", { board, currentPlayer });
    io.emit("updatePlayers", Object.values(players));
  });
});

const isValidMove = (row, col, socket) => {
  if (
    row < 0 ||
    row >= board.length ||
    col < 0 ||
    col >= board[0].length ||
    board[row][col] !== null ||
    !players[socket.id] || // check if players[socket.id] is defined
    players[socket.id].color !== currentPlayer
  ) {
    return false;
  }
  return true;
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

const resetGame = () => {
  board = Array(6)
    .fill(null)
    .map(() => Array(7).fill(null));
  currentPlayer = "R";
};

module.exports = {
  app,
  serverHttp,
  io,
};

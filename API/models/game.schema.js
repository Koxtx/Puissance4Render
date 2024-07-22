const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    board: {
      type: [[String]],
      default: Array(6).fill(Array(7).fill(null)),
    },
    currentPlayer: {
      type: String,
      enum: ["R", "Y"],
      default: "R",
    },
    status: {
      type: String,
      enum: ["ongoing", "finished"],
      default: "ongoing",
    },
    winner: {
      type: String,
      enum: ["R", "Y", "draw", null],
      default: null,
    },
    player1Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    player2Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    history: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "History",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", gameSchema);

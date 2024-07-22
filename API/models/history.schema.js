const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    opponent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isUserWinner: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", historySchema);

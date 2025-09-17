// server/src/models/Match.js
const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema(
  {
    postA: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    postB: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: false },
    votesA: { type: Number, default: 0 },
    votesB: { type: Number, default: 0 },
    round: { type: Number, default: 1 },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },  
    finished: { type: Boolean, default: false },
    votesByPost: {
      type: [
        {
          post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
          voter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          choice: { type: String, enum: ["A", "B"] },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", MatchSchema);

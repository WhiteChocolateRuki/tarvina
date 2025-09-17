const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Match = require("../models/Match");
const Post = require("../models/Post");
const auth = require("../middleware/authMiddleware");


router.post("/start", auth, async (req, res) => {
  try {
    const existing = await Match.find({ round: 1 });
    if (existing.length > 0) {
      const populated = await Match.find({ round: 1 })
        .populate("postA", "title content")
        .populate("postB", "title content");
      return res.json(populated);
    }

    const posts = await Post.find();
    if (posts.length < 2) {
      return res.status(400).json({ error: "Yeterli yazı yok" });
    }

    const candidates = [];
    for (let i = 0; i < posts.length; i += 2) {
      if (posts[i + 1]) {
        await Match.create({
          postA: posts[i]._id,
          postB: posts[i + 1]._id,
          round: 1,
          votesA: 0,
          votesB: 0,
          voters: [],
          finished: false
        });
      } else {
        candidates.push(posts[i]._id);
      }
    }

    if (candidates.length > 0) {
      await Match.create({
        postA: candidates[0],
        postB: null,
        round: 2,
        votesA: 1,
        votesB: 0,
        voters: [],
        finished: true,
        winner: candidates[0]
      });
    }

    const populated = await Match.find({ round: 1 })
      .populate("postA", "title content")
      .populate("postB", "title content");

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Tur başlatma hatası", detail: err.message });
  }
});


router.post("/votes/:id", auth, async (req, res) => {
  try {
    const { choice } = req.body; 
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ error: "Eşleşme bulunamadı" });

    const userId = req.user._id; 

    
    const prevVote = match.votesByPost.find(v => v.voter.toString() === userId.toString());

    if (prevVote) {
   
      if (prevVote.choice === "A") match.votesA--;
      if (prevVote.choice === "B") match.votesB--;

     
      prevVote.choice = choice;
    } else {
     
      match.votesByPost.push({ voter: userId, choice });
    }

  
    if (choice === "A") match.votesA++;
    if (choice === "B") match.votesB++;


    if (!match.voters.some(v => v.toString() === userId.toString())) {
      match.voters.push(new mongoose.Types.ObjectId(userId));
    }

    await match.save();

    res.json({ votesA: match.votesA, votesB: match.votesB });
  } catch (err) {
    console.error("Oy kullanma hatası:", err);
    res.status(500).json({ error: "Oy kullanma hatası", detail: err.message });
  }
});


router.post("/next-round", auth, async (req, res) => {
  try {
    const { currentRound } = req.body;
    const matches = await Match.find({ round: currentRound });
    if (matches.length === 0) {
      return res.status(400).json({ error: "Bu round bulunamadı" });
    }

   
    const allMatchesVoted = matches.every(m => m.votesA + m.votesB > 0);
    if (!allMatchesVoted) {
      return res.status(400).json({ error: "Tüm eşleşmelerde en az bir oy olmalı." });
    }

    for (let m of matches) {
      m.finished = true;
      m.winner = (m.votesA >= m.votesB) ? m.postA : m.postB;
      await m.save();
    }

    const winners = matches.map(m => m.winner).filter(Boolean);

    if (winners.length === 1) {
      const finalWinner = await Post.findById(winners[0])
        .populate("authorId", "name email");

      return res.status(200).json({
        message: "Turnuva bitti",
        winner: {
          id: finalWinner._id,
          title: finalWinner.title,
          author: finalWinner.authorId ? finalWinner.authorId.name : "Bilinmeyen Yazar"
        }
      });
    }

    const nextRound = currentRound + 1;
    const nextCandidates = [...winners];
    let bye = null;

    if (nextCandidates.length % 2 === 1) {
      bye = nextCandidates.pop();
    }

    for (let i = 0; i < nextCandidates.length; i += 2) {
      await Match.create({
        postA: nextCandidates[i],
        postB: nextCandidates[i + 1],
        round: nextRound,
        votesA: 0,
        votesB: 0,
        voters: [],
        finished: false,
      });
    }

    if (bye) {
      await Match.create({
        postA: bye,
        postB: null,
        round: nextRound,
        votesA: 1,
        votesB: 0,
        voters: [],
        finished: true,
        winner: bye,
      });
    }

    const populated = await Match.find({ round: nextRound })
      .populate("postA", "title content")
      .populate("postB", "title content");

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sonraki tur hatası", detail: err.message });
  }
});


router.get("/round/:round", auth, async (req, res) => {
  try {
    const round = parseInt(req.params.round, 10);
    const matches = await Match.find({ round })
      .populate("postA", "title content")
      .populate("postB", "title content");

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Round getirme hatası", detail: err.message });
  }
});

module.exports = router;

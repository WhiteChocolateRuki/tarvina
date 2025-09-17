// server/src/routes/votes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Match = require("../models/Match");
const auth = require("../middleware/authMiddleware");

// Oy verme veya güncelleme
router.post("/:matchId", auth, async (req, res) => {
  try {
    const { choice } = req.body; // "A" veya "B"
    if (!["A", "B"].includes(choice)) {
      return res.status(400).json({ error: "choice sadece A veya B olabilir" });
    }

    const match = await Match.findById(req.params.matchId);
    if (!match) return res.status(404).json({ error: "Eşleşme bulunamadı" });
    if (match.finished) return res.status(400).json({ error: "Bu eşleşme bitmiş" });

    const userId = req.user._id.toString(); // ✅ JWT payload _id

    // Kullanıcı daha önce oy vermiş mi?
    const prevVote = (match.votesByPost || []).find(
      (v) => v.voter && v.voter.toString() === userId
    );

    if (prevVote) {
      // Eski oyu geri al
      if (prevVote.choice === "A") match.votesA = Math.max(0, match.votesA - 1);
      if (prevVote.choice === "B") match.votesB = Math.max(0, match.votesB - 1);

      // Yeni seçimi kaydet
      prevVote.choice = choice;
      prevVote.post = choice === "A" ? match.postA : match.postB;
    } else {
      // İlk oy
      match.votesByPost.push({
        post: choice === "A" ? match.postA : match.postB,
        voter: new mongoose.Types.ObjectId(userId),
        choice,
      });

      // voters listesine ekle (daha önce yoksa)
      if (!match.voters.some((v) => v.toString() === userId)) {
        match.voters.push(new mongoose.Types.ObjectId(userId));
      }
    }

    // Yeni oyu artır
    if (choice === "A") match.votesA += 1;
    if (choice === "B") match.votesB += 1;

    // Kazananı belirle (eşitlik olursa null)
    if (match.votesA > match.votesB) match.winner = match.postA;
    else if (match.votesB > match.votesA) match.winner = match.postB;
    else match.winner = null;

    await match.save();

    const total = match.votesA + match.votesB;
    const percentA = total ? (match.votesA / total) * 100 : 0;
    const percentB = total ? (match.votesB / total) * 100 : 0;

    res.json({
      votesA: match.votesA,
      votesB: match.votesB,
      percentA,
      percentB,
      totalVotes: total,
      winner: match.winner,
    });
  } catch (err) {
    console.error("Oy kullanma hatası:", err);
    res.status(500).json({ error: "Oy kullanma hatası", detail: err.message });
  }
});

module.exports = router;

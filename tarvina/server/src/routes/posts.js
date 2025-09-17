const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Match = require("../models/Match");
const auth = require("../middleware/authMiddleware");

function validatePostInput(body) {
  const errors = {};
  if (!body.title || !body.title.trim()) errors.title = "Başlık zorunlu";
  if (!body.content || !body.content.trim()) errors.content = "İçerik zorunlu";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true };
}


router.get("/", async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate("authorId", "name")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const withWinners = await Match.find({ winner: { $ne: null } })
      .sort({ round: -1, updatedAt: -1 })
      .select("winner round")
      .lean();

    let championId = null;

    if (withWinners.length) {
      const maxRound = withWinners[0].round;
      const finals = withWinners.filter((m) => m.round === maxRound);

      if (finals.length === 1 && finals[0].winner) {
        championId = finals[0].winner.toString();
      }
    }

    const enriched = posts.map((p) => ({
      ...p,
      isWinner: championId ? p._id.toString() === championId : false,
    }));

    res.json(enriched);
  } catch (e) {
    console.error("GET /api/posts error:", e.message);
    res.status(500).json({ error: "Posts fetch failed" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("authorId", "name email");

    if (!post) return res.status(404).json({ error: "Yazı bulunamadı" });

    res.json(post);
  } catch (err) {
    console.error("GET /api/posts/:id error:", err.message);
    res.status(500).json({ error: "Post fetch failed" });
  }
});

router.post("/", auth, async (req, res) => {
  const v = validatePostInput(req.body);
  if (!v.ok) return res.status(400).json({ errors: v.errors });

  try {
    const { title, content, category, imageUrl } = req.body;
    const doc = await Post.create({
      title,
      content,
      category: category || "Genel",
      imageUrl: imageUrl || "",
      authorId: req.user._id,
    });
    await doc.populate("authorId", "name");

    
    const allMatches = await Match.find();
    const usedPostIds = allMatches.flatMap(m => [m.postA, m.postB].filter(Boolean));

  
    const unmatched = await Post.findOne({ _id: { $nin: usedPostIds, $ne: doc._id } });

    if (unmatched) {
  
      await Match.create({
        postA: unmatched._id,
        postB: doc._id,
        round: 1,
        votesA: 0,
        votesB: 0,
        voters: [],
        finished: false,
      });
    } else {
      // Bye → otomatik kazanan olarak bir üst tura
      await Match.create({
        postA: doc._id,
        postB: null,
        round: 1,
        votesA: 1,
        votesB: 0,
        voters: [],
        finished: true,
        winner: doc._id,
      });
    }

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: "Oluşturulamadı", detail: err.message });
  }
});



router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Yazı bulunamadı" });
    if (post.authorId.toString() !== req.user._id)
      return res.status(403).json({ error: "Bu yazıyı güncelleme yetkin yok" });

    ["title", "content", "category", "imageUrl"].forEach((k) => {
      if (req.body[k] !== undefined) post[k] = req.body[k];
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: "Güncellenemedi", detail: err.message });
  }
});

// DELETE 
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Yazı bulunamadı" });
    if (post.authorId.toString() !== req.user._id) 
      return res.status(403).json({ error: "Bu yazıyı silme yetkin yok" });

    await post.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: "Silinemedi", detail: err.message });
  }
});

module.exports = router;

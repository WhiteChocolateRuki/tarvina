const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error", err));

// ✅ Test endpoint (ana sayfa)
app.get("/", (_req, res) => res.json({ message: "API çalışıyor!" }));



// ✅ ROUTE'lar
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/posts", require("./src/routes/posts"));  // Artık bu çalışacak
app.use("/api/votes", require("./src/routes/votes"));
app.use("/api/matches", require("./src/routes/matches"));



// ✅ Sunucuyu başlat
app.listen(process.env.PORT, () => {
  console.log(`API http://localhost:${process.env.PORT}`);
});

// src/models/Blog.js
const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // URL ya da base64 olabilir
  category: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Blog", BlogSchema);

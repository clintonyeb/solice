var mongoose = require("mongoose");

const AdSchema = new mongoose.Schema({
  text: String,
  url: String,
  image: String,
  created: { type: Date, default: Date.now },
});

// CommentSchema.index({ text: "text" });
module.exports = mongoose.model("ads", AdSchema);

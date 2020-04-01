var mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: String,
  created: { type: Date, default: Date.now },
  postedBy: { type: mongoose.Schema.ObjectId, ref: "users" }
});

// CommentSchema.index({ text: "text" });
module.exports = mongoose.model("comments", CommentSchema);

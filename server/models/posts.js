var mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: "Name is required"
  },
  photo: {
    type: String,
    required: false
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "users" }],
  comments: [
    {
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: { type: mongoose.Schema.ObjectId, ref: "users" }
    }
  ],
  postedBy: { type: mongoose.Schema.ObjectId, ref: "users" },
  created: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Number,
    enum: Object.values(require("../utils/post-status")),
    required: true
  }
});

// PostSchema.index({ text: "text" });
module.exports = mongoose.model("posts", PostSchema);

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
  comments: [{ type: mongoose.Schema.ObjectId, ref: "comments" }
  ],
  postedBy: { type: mongoose.Schema.ObjectId, ref: "users" },
  created: {
    type: Date,
    default: Date.now
  }
});

// PostSchema.index({ text: "text" });
module.exports = mongoose.model("posts", PostSchema);

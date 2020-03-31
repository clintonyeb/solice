var mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  type: {
    type: Number,
    enum: Object.values(require("../utils/noti-types")),
    required: true
  },
  targetUser: { type: mongoose.Schema.ObjectId, ref: "users" },
  targetPost: { type: mongoose.Schema.ObjectId, ref: "posts" },
  created: { type: Date, default: Date.now },
  postedBy: { type: mongoose.Schema.ObjectId, ref: "users" },
  status: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("notifications", NotificationSchema);

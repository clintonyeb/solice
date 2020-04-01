var mongoose = require("mongoose");

const WordSchema = new mongoose.Schema({
  text: { type: String, required: true, unique: true }
});

WordSchema.index({ text: "text" });
module.exports = mongoose.model("words", WordSchema);

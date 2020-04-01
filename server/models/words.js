var mongoose = require("mongoose");

const WordSchema = new mongoose.Schema({
  text: [String]
});

module.exports = mongoose.model("words", WordSchema);

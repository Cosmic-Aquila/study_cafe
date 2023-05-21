const mongoose = require("mongoose");

const suggestions = mongoose.Schema({
  messageID: Number,
  suggestionID: Number,
  memberID: String,
});
module.exports = mongoose.model("suggestions", suggestions);

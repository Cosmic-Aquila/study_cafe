const mongoose = require("mongoose");

const rep = mongoose.Schema({
  guildID: String,
  memberID: String,
  lastUsed: Number,
});
module.exports = mongoose.model("rep", rep);

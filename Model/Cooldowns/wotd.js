const mongoose = require("mongoose");

const wotd = mongoose.Schema({
  guildID: String,
  lastUsed: Number,
});
module.exports = mongoose.model("wotd", wotd);

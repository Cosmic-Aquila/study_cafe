const mongoose = require("mongoose");

const qotd = mongoose.Schema({
  guildID: String,
  lastUsed: Number,
});
module.exports = mongoose.model("qotd", qotd);

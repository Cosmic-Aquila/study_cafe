const mongoose = require("mongoose");

const jotd = mongoose.Schema({
  guildID: String,
  lastUsed: Number,
});
module.exports = mongoose.model("jotd", jotd);

const mongoose = require("mongoose");

const announce = mongoose.Schema({
  guildID: String,
  lastUsed: Number,
});
module.exports = mongoose.model("announce", announce);

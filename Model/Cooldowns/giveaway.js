const mongoose = require("mongoose");

const giveaway = mongoose.Schema({
  guildID: String,
  lastUsed: Number,
});
module.exports = mongoose.model("giveaway", giveaway);

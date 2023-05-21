const mongoose = require("mongoose");

const fotd = mongoose.Schema({
  guildID: String,
  lastUsed: Number,
});
module.exports = mongoose.model("fotd", fotd);

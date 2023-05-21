const mongoose = require("mongoose");

const helper = mongoose.Schema({
  guildID: String,
  memberID: String,
  lastUsed: Number,
});
module.exports = mongoose.model("helper", helper);

const mongoose = require("mongoose");

const dcp = mongoose.Schema({
  guildID: String,
  lastUsed: Number,
});
module.exports = mongoose.model("dcp", dcp);

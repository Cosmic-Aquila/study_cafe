const mongoose = require("mongoose");

const mutes = mongoose.Schema({
  memberID: String,
  duration: String,
  startedAt: Date,
});
module.exports = mongoose.model("mutes", mutes);

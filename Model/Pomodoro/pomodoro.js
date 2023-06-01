const mongoose = require("mongoose");

const pomodoro = mongoose.Schema({
  memberID: String,
  work: Number,
  break: Number,
  voiceChannelID: String,
  joinedAt: Date,
  type: String,
  hasVerified: Boolean,
  hasReminded: Boolean,
  breakChannelID: String,
});

module.exports = mongoose.model("pomodoro", pomodoro);

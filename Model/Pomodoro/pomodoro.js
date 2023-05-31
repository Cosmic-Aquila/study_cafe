const mongoose = require("mongoose");

const pomodoro = mongoose.Schema({
  memberID: String,
  work: Number,
  break: Number,
  voiceChannelID: String,
  joinedAt: Date,
  type: String,
  hasVerfied: Boolean,
  breakChannelID: String,
});

module.exports = mongoose.model("pomodoro", pomodoro);

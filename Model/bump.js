const mongoose = require("mongoose");

const bump = mongoose.Schema({
  lastBumped: Date,
  hasPinged: Boolean,
});
module.exports = mongoose.model("bump", bump);

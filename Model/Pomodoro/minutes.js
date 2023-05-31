const mongoose = require("mongoose");

const minutes = mongoose.Schema({
  memberID: String,
  points: Number,
});

module.exports = mongoose.model("minutes", minutes);

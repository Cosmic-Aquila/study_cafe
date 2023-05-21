const mongoose = require("mongoose");

const counting = mongoose.Schema({
  count: Number,
  lastCounter: String,
});
module.exports = mongoose.model("counting", counting);

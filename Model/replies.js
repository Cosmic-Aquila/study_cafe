const mongoose = require("mongoose");

const replies = mongoose.Schema({
  reply: String,
  trigger: String,
});
module.exports = mongoose.model("replies", replies);

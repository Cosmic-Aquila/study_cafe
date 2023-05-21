const mongoose = require("mongoose");

const backgrounds = mongoose.Schema({
  memberID: String,
  background: String,
  color: String,
});
module.exports = mongoose.model("backgrounds", backgrounds);

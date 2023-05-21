const mongoose = require("mongoose");

const warns = mongoose.Schema({
  memberID: String,
  reasons: [String],
});
module.exports = mongoose.model("warns", warns);

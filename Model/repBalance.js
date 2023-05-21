const mongoose = require("mongoose");

const repCount = mongoose.Schema({
  memberID: String,
  repAmount: {
    default: 0,
    type: Number,
  },
});
module.exports = mongoose.model("repCount", repCount);

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  available: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
});
module.exports = mongoose.model("Rent", postSchema);

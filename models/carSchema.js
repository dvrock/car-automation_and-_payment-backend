const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  car_picture: [
    {
      type: String,
    },
  ],
  available: {
    type: String,
  },
  speed: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
});

module.exports = mongoose.model("Car", postSchema);

const mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  Profile_picture: {
    type: String,
  },
  DOB: {
    type: String,
  },
  ID: {
    type: String,
  },
  verify: {
    type: Boolean,
  },
  uniqueId: [
    {
      type: ObjectId,
      ref: "Post",
    },
  ],
});
module.exports = mongoose.model("User", userSchema);

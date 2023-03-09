const mongoose = require("mongoose");
console.log(mongoose.Schema.Types.ObjectId);
const postSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  userprofile_picture: {
    type: String,
  },
  likes: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("Post", postSchema);

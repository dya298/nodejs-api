const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const noteSchema = new mongoose.Schema({
  title: String,

  desc: String,

  topic_id: ObjectId,

  user_id: ObjectId,

  profile_img: String,

  cloudinary_id: String
});

module.exports = mongoose.model("Notes", noteSchema);

const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const noteSchema = new mongoose.Schema({
  title: String,
  desc: String,
  topic_id: ObjectId
});

module.exports = mongoose.model("Notes", noteSchema);

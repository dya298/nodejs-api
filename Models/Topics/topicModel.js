const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  title: String,
  desc: String
});

module.exports = mongoose.model("Topic", topicSchema);

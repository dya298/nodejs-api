const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const noteSchema = new mongoose.Schema({
  title: String,

  desc: String,

  time: {
    type: Date,
    default: () => {
      var current = new Date();
      const timeStamp = new Date(
        Date.UTC(
          current.getFullYear(),
          current.getMonth(),
          current.getDate(),
          current.getHours(),
          current.getMinutes(),
          current.getSeconds(),
          current.getMilliseconds()
        )
      );
      return timeStamp;
    },
  },

  topic_id: ObjectId,

  user_id: ObjectId,

  profile_img: String,

  cloudinary_id: String,
});

module.exports = mongoose.model("Notes", noteSchema);
